import { supabase } from "@/lib/supabase";

/**
 * Generates an avatar URL for a user based on their username
 * @param username The username to generate an avatar for
 * @param userId The user ID
 * @returns The URL of the generated avatar
 */
export async function generateAvatarUrl(username: string, userId: string): Promise<string | null> {
  try {
    // Create a consistent filename based on username for easier retrieval
    const fileName = `${username}-avatar.png`;
    
    // Check if avatar already exists
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list('', {
        search: fileName
      });
    
    if (existingFiles && existingFiles.length > 0) {
      // Avatar already exists, return its URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      return publicUrl;
    }
    
    // Generate a new avatar
    const response = await fetch('/api/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate avatar');
    }
    
    const { publicUrl } = await response.json();
    return publicUrl;
  } catch (error) {
    console.error('Error generating avatar:', error);
    return null;
  }
}

/**
 * Updates a user's profile information
 * @param userId The user ID
 * @param metadata The metadata to update
 * @returns True if successful, false otherwise
 */
export async function updateUserProfile(userId: string, metadata: Record<string, unknown>): Promise<boolean> {
  try {
    // Get existing metadata to avoid overwriting other fields
    const { data: userData } = await supabase.auth.getUser();
    const existingMetadata = userData?.user?.user_metadata || {};
    
    // Update the metadata
    const { error } = await supabase.auth.updateUser({
      data: { 
        ...existingMetadata,
        ...metadata
      }
    });
    
    if (error) {
      console.error('Update error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}
