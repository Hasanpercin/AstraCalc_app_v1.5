import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Check if actual Supabase credentials are provided
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: AsyncStorage,
        detectSessionInUrl: false,
      },
    })
  : null;

// Authentication functions
export const authService = {
  async signUp(email: string, password: string, userData: any) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    if (!supabase) throw new Error('Supabase not configured');
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
};

// Database functions
export const dbService = {
  async createUserProfile(userId: string, profileData: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.rpc('upsert_user_profile', {
      p_user_id: userId,
      p_first_name: profileData.first_name,
      p_last_name: profileData.last_name,
      p_email: profileData.email,
      p_avatar_url: profileData.avatar_url || null,
    });
    
    return { data, error };
  },

  async getUserProfile(userId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async updateUserProfile(userId: string, updates: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.rpc('upsert_user_profile', {
      p_user_id: userId,
      p_first_name: updates.first_name,
      p_last_name: updates.last_name,
      p_email: updates.email,
      p_avatar_url: updates.avatar_url || null,
    });
    
    return { data, error };
  },
};