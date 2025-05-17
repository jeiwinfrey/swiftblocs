import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { signInWithCredentials } from '@/lib/authService';

export function useLoginForm() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth(); // Use a different name for auth loading state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // For form submission loading
  const [error, setError] = useState<string | null>(null);

  // Redirect to home if already logged in and auth state is determined
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  const handleCredentialsLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithCredentials({ identifier, password });
      // Successful login is handled by the AuthProvider and the useEffect above,
      // or you can explicitly push here if preferred after auth state updates.
      // router.push('/'); // Consider if redirection should be solely based on `user` state change
      router.refresh(); // Refresh server components
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    handleCredentialsLogin,
    isAuthLoading, // Expose auth loading state for UI decisions if needed
  };
}
