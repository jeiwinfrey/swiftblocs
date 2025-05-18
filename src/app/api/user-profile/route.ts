import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Create a server-side Supabase client with admin privileges
    const supabaseAdmin = createServerSupabaseClient();

    // First, try to find the user by matching the username in user_metadata
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error listing users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Find the user with matching username in metadata
    const user = users.users.find((u: User) => 
      u.user_metadata?.username?.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      // If no user found with that username, try to match by email prefix
      const possibleUser = users.users.find((u: User) => 
        u.email?.split('@')[0].toLowerCase() === username.toLowerCase()
      );

      if (possibleUser) {
        return NextResponse.json({
          id: possibleUser.id,
          username: possibleUser.user_metadata?.username || possibleUser.email?.split('@')[0],
          avatar_url: possibleUser.user_metadata?.avatar_url || null
        });
      }

      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user's profile information
    return NextResponse.json({
      id: user.id,
      username: user.user_metadata?.username || user.email?.split('@')[0],
      display_name: user.user_metadata?.display_name || null,
      bio: user.user_metadata?.bio || null,
      avatar_url: user.user_metadata?.avatar_url || null
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
