import { useState, useEffect } from 'react';
import { supabase, authService } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      return result;
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) {
      // Demo mode - clear user state and return success
      setUser(null);
      setLoading(false);
      return { error: null };
    }
    setLoading(true);
    try {
      const result = await authService.signOut();
      
      // If signOut succeeds, user state will be updated by onAuthStateChange
      // If it fails, we still need to clear local state for consistency
      if (result.error) {
        console.warn('SignOut API failed, clearing local state:', result.error);
        setUser(null);
      }
      
      return result;
    } catch (error) {
      // Clear user state even if there's an error
      setUser(null);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    setLoading(true);
    try {
      const result = await authService.signUp(email, password, userData);
      return result;
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}