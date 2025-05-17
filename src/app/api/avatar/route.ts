import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;
    
    if (!file || !userId) {
      return NextResponse.json({ error: 'File and userId are required' }, { status: 400 });
    }
    
    // Create a server-side Supabase client with admin privileges
    const supabaseAdmin = createServerSupabaseClient();
    
    // Generate a consistent filename based on username for easier retrieval
    const fileExt = 'png'; // Always save as PNG for consistency
    const fileName = username 
      ? `${username}-avatar.${fileExt}` // Consistent name for easier retrieval
      : `${userId}-avatar.${fileExt}`;
    const filePath = fileName; // No need for a subfolder
    
    // Convert file to ArrayBuffer for processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Resize the image to 64x64 using sharp for bucket storage saving
    const resizedImageBuffer = await sharp(buffer)
      .resize(128, 128, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90 })
      .toBuffer();
    
    // Upload the resized file to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, resizedImageBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update user metadata with the new avatar URL
    // First get existing metadata to avoid overwriting other fields
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
    const existingMetadata = userData?.user?.user_metadata || {};
    
    // Update the metadata with the new avatar URL
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { 
          ...existingMetadata,
          avatar_url: publicUrl 
        } 
      }
    );
    
    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
