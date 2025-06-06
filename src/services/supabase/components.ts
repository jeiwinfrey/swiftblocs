import { supabase } from './client';

// Define the Component type
export interface Component {
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
  created_at: string;
  imageUrl?: string;
}

// Define the update component payload type
export interface UpdateComponentPayload {
  component_title?: string;
  description?: string;
  tags?: string[];
  code?: string;
  // Add other fields that can be updated as needed
}

/**
 * Fetches all components from the database
 * @returns Array of components with generated image URLs
 */
export async function getComponents(): Promise<Component[]> {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*');
    
    if (error) {
      console.error('Error fetching components:', error);
      return [];
    }
    
    // Generate image URLs for the components
    return data.map((component) => ({
      ...component,
      imageUrl: generateImageUrl(component)
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Fetches a single component by its ID
 * @param id The component ID
 * @returns The component with generated image URL or null if not found
 */
export async function getComponentById(id: string): Promise<Component | null> {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching component:', error);
      return null;
    }
    
    return {
      ...data,
      imageUrl: generateImageUrl(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

/**
 * Generates the image URL for a component
 * @param component The component object
 * @returns The full image URL
 */
function generateImageUrl(component: Component): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${component.image_storage_path}/${component.image_file_name}`;
}

/**
 * Updates a component in the database
 * @param id The component ID
 * @param updates The fields to update
 * @returns The updated component or null if update failed
 */
export async function updateComponent(id: string, updates: UpdateComponentPayload): Promise<Component | null> {
  try {
    console.log('Updating component with ID:', id);
    console.log('Update payload:', updates);
    
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('User not authenticated for update operation');
      return null;
    }
    
    // Create a new object that only includes the fields we want to update
    // This prevents issues with read-only fields or fields with special permissions
    const safeUpdates: UpdateComponentPayload = {};
    
    // Only include fields that are present in the updates object
    if (updates.component_title !== undefined) safeUpdates.component_title = updates.component_title;
    if (updates.description !== undefined) safeUpdates.description = updates.description;
    if (updates.tags !== undefined) safeUpdates.tags = updates.tags;
    if (updates.code !== undefined) safeUpdates.code = updates.code;
    
    console.log('Safe update payload:', safeUpdates);
    
    // Call the API route to update the component
    const response = await fetch(`/api/components/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safeUpdates),
    });
    
    if (!response.ok) {
      console.error('Error updating component:', await response.text());
      return null;
    }
    
    const updatedComponent = await response.json();
    console.log('Update successful, returned data:', updatedComponent);
    
    return {
      ...updatedComponent,
      imageUrl: generateImageUrl(updatedComponent)
    };
  } catch (error) {
    console.error('Error updating component:', error);
    return null;
  }
}

/**
 * Deletes a component from the database
 * @param id The component ID
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteComponent(id: string): Promise<boolean> {
  try {
    console.log('Deleting component with ID:', id);
    
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('User not authenticated for delete operation');
      return false;
    }
    
    // Call the API route to delete the component
    const response = await fetch(`/api/components/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.error('Error deleting component:', await response.text());
      return false;
    }
    
    console.log('Component deletion completed successfully');
    return true;
  } catch (error) {
    console.error('Error deleting component:', error);
    return false;
  }
}
