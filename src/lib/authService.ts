import { supabase } from "@/lib/supabase";

export interface AuthCredentials {
  identifier: string;
  password?: string; // Password might not be needed for all auth strategies
}

/**
 * Signs in a user with their identifier (email or username) and password.
 */
export async function signInWithCredentials(credentials: Required<AuthCredentials>) {
  const { identifier, password } = credentials;
  const isEmail = identifier.includes('@');

  let emailToUse: string;
  if (isEmail) {
    emailToUse = identifier;
  } else {
    // This is a workaround for username login as Supabase expects an email.
    // In a production app, you might first query a 'profiles' table to find the email associated with the username.
    // For now, we append a placeholder domain.
    emailToUse = `${identifier}@users.swiftblocs.com`; 
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });

  if (error) {
    // Consolidate error handling or re-throw for the hook to catch
    console.error('Supabase signInWithPassword error:', error.message);
    throw error; 
  }
  return data;
}



/**
 * Signs out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Supabase signOut error:', error.message);
    throw error;
  }
}
