import { supabase } from './client';

// Define the Creator type
export interface Creator {
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  componentCount: number;
  totalViews: number;
  totalBookmarks: number;
}

/**
 * Fetches all creators with their component statistics
 * @returns Array of creators with their component statistics
 */
export async function getCreators(): Promise<Creator[]> {
  try {
    // First, get all components grouped by author
    const { data: componentsData, error: componentsError } = await supabase
      .from('components')
      .select('author, views_count, bookmarks_count');
    
    if (componentsError) {
      console.error('Error fetching components:', componentsError);
      return [];
    }

    // Group components by author and calculate statistics
    const creatorStats: Record<string, { componentCount: number; totalViews: number; totalBookmarks: number }> = {};
    
    componentsData.forEach(component => {
      if (!component.author) return;
      
      if (!creatorStats[component.author]) {
        creatorStats[component.author] = {
          componentCount: 0,
          totalViews: 0,
          totalBookmarks: 0
        };
      }
      
      creatorStats[component.author].componentCount += 1;
      creatorStats[component.author].totalViews += component.views_count || 0;
      creatorStats[component.author].totalBookmarks += component.bookmarks_count || 0;
    });
    
    // Get user profiles for all creators
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      
      // Even if we can't get user profiles, we can still return basic creator stats
      return Object.entries(creatorStats).map(([username, stats]) => ({
        username,
        ...stats
      }));
    }
    
    // Combine user profiles with creator stats
    const creators: Creator[] = [];
    
    Object.entries(creatorStats).forEach(([username, stats]) => {
      // Find the user profile for this creator
      const userProfile = usersData.users.find(
        user => user.user_metadata?.username === username
      );
      
      creators.push({
        username,
        display_name: userProfile?.user_metadata?.display_name,
        bio: userProfile?.user_metadata?.bio,
        avatar_url: userProfile?.user_metadata?.avatar_url,
        ...stats
      });
    });
    
    return creators;
  } catch (error) {
    console.error('Error fetching creators:', error);
    return [];
  }
}

/**
 * Alternative implementation that doesn't require admin access
 * This uses a more limited approach but will work with regular user permissions
 */
export async function getCreatorsBasic(): Promise<Creator[]> {
  try {
    // Get all components
    const { data: componentsData, error: componentsError } = await supabase
      .from('components')
      .select('author, views_count, bookmarks_count');
    
    if (componentsError) {
      console.error('Error fetching components:', componentsError);
      return [];
    }

    // Group components by author and calculate statistics
    const creatorStats: Record<string, { componentCount: number; totalViews: number; totalBookmarks: number }> = {};
    
    componentsData.forEach(component => {
      if (!component.author) return;
      
      if (!creatorStats[component.author]) {
        creatorStats[component.author] = {
          componentCount: 0,
          totalViews: 0,
          totalBookmarks: 0
        };
      }
      
      creatorStats[component.author].componentCount += 1;
      creatorStats[component.author].totalViews += component.views_count || 0;
      creatorStats[component.author].totalBookmarks += component.bookmarks_count || 0;
    });
    
    // Get the list of creators
    const creators: Creator[] = [];
    
    // Get user profiles for all creators
    const usernames = Object.keys(creatorStats);
    
    // Get the current user's metadata from the session
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user;
    
    // Convert to array of creators with available metadata
    for (const username of usernames) {
      let bio = undefined;
      let display_name = undefined;
      let avatar_url = undefined;
      
      // If this is the current user, we can get their metadata directly
      if (currentUser && currentUser.user_metadata?.username === username) {
        bio = currentUser.user_metadata?.bio;
        display_name = currentUser.user_metadata?.display_name;
        avatar_url = currentUser.user_metadata?.avatar_url;
      } else {
        // For other users, try to get their public profile
        try {
          // Use the user-profile API endpoint to get the user's metadata
          const response = await fetch(`/api/user-profile?username=${encodeURIComponent(username)}`);
          if (response.ok) {
            const userData = await response.json();
            bio = userData.bio;
            display_name = userData.display_name;
            avatar_url = userData.avatar_url;
          }
        } catch (err) {
          console.error(`Error fetching profile for ${username}:`, err);
          // Continue with undefined metadata
        }
      }
      
      creators.push({
        username,
        bio,
        display_name,
        avatar_url,
        ...creatorStats[username]
      });
    }
    
    return creators;
  } catch (error) {
    console.error('Error fetching creators:', error);
    return [];
  }
}
