import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    
    // Get the update data from the request body
    const updates = await request.json();
    
    // Update the component in the database
    const { data, error } = await supabase
      .from('components')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating component:', error);
      return NextResponse.json(
        { error: 'Failed to update component' },
        { status: 500 }
      );
    }
    
    // Return the updated component
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    
    // First get the component to find the image path
    const { data: component, error: getError } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError || !component) {
      console.error('Error getting component:', getError);
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }
    
    // Delete the component from the database
    const { error: deleteError } = await supabase
      .from('components')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting component:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete component' },
        { status: 500 }
      );
    }
    
    // Delete the associated image from storage
    if (component.image_storage_path && component.image_file_name) {
      const { error: storageError } = await supabase
        .storage
        .from(component.image_storage_path)
        .remove([component.image_file_name]);
      
      if (storageError) {
        console.error('Error deleting image:', storageError);
        // We don't return an error here since the component was deleted
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
