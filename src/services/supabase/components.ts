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
