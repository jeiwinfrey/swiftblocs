import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createServerSupabaseClient } from '@/lib/supabase';

// Define the component type for better type safety
interface Component {
  id: string;
  author: string;
  component_title: string;
  description: string;
  views_count: number;
  bookmarks_count: number;
  image_storage_path: string;
  image_file_name: string;
  tags: string[];
  code: string;
  created_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client with RLS bypass for server operations
    const supabase = createServerSupabaseClient();
    
    // Create a unique ID for the component
    const id = uuidv4();
    
    // Get form data from the request
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tag = formData.get('tag') as string;
    const code = formData.get('code') as string;
    const image = formData.get('image') as File;
    const userId = formData.get('userId') as string; // Get userId from form data
    
    // Validate required fields
    if (!title || !description || !tag || !code || !image || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get user data to extract username
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { message: 'Failed to authenticate user' },
        { status: 401 }
      );
    }
    
    // Extract username from user metadata or use userId as fallback
    const username = userData.user?.user_metadata?.username || userId;
    
    // Generate unique filename for the image
    const fileExtension = image.name.split('.').pop() || '';
    const fileName = `${id}-${Date.now()}.${fileExtension}`;
    
    // Set paths for storage
    const imagePath = 'component-images';
    const imageFileName = fileName;
    
    // Using existing 'component-images' bucket
    
    // Upload image to Supabase storage
    const { error: uploadError } = await supabase
      .storage
      .from(imagePath)
      .upload(fileName, await image.arrayBuffer(), {
        contentType: image.type,
        upsert: true // Use upsert to overwrite if exists
      });
    
    if (uploadError) {
      console.error('Error uploading to Supabase storage:', uploadError);
      return NextResponse.json(
        { message: `Failed to upload image: ${uploadError.message}` },
        { status: 500 }
      );
    }
    
    // Create component object for Supabase
    const component: Component = {
      id,
      author: username, // Use the extracted username instead of hardcoded value
      component_title: title,
      description,
      views_count: 0,
      bookmarks_count: 0,
      image_storage_path: imagePath,
      image_file_name: imageFileName,
      tags: [tag], // Convert to array since the database expects an array
      code,
    };
    
    // Insert the component into the Supabase database
    const { data, error } = await supabase
      .from('components')
      .insert(component)
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting into Supabase:', error);
      return NextResponse.json(
        { 
          message: `Failed to save component to database: ${error.message}`,
          details: error
        },
        { status: 500 }
      );
    }
    
    // Log for debugging
    console.log('Component created:', data);
    
    // Return success response with the component data
    return NextResponse.json({ 
      message: 'Component created successfully',
      id,
      component
    });
    
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
