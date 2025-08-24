import { supabase } from '@/lib/supabase';
import { 
  UserProfile, 
  UserRegistrationData, 
  RegistrationResponse, 
  RegistrationError,
  ValidationErrors,
  UserDisplayInfo,
  DuplicateNameContext
} from '@/types/user';

/**
 * Comprehensive User Registration Service
 * Handles duplicate names while enforcing unique emails
 */
export class UserRegistrationService {
  
  /**
   * Validate registration data before submission
   */
  static validateRegistrationData(data: UserRegistrationData): ValidationErrors {
    const errors: ValidationErrors = {};
    
    // Validate first name
    if (!data.first_name?.trim()) {
      errors.first_name = 'First name is required';
    } else if (data.first_name.trim().length < 2) {
      errors.first_name = 'First name must be at least 2 characters';
    } else if (data.first_name.trim().length > 50) {
      errors.first_name = 'First name must be less than 50 characters';
    }
    
    // Validate last name
    if (!data.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    } else if (data.last_name.trim().length < 2) {
      errors.last_name = 'Last name must be at least 2 characters';
    } else if (data.last_name.trim().length > 50) {
      errors.last_name = 'Last name must be less than 50 characters';
    }
    
    // Validate email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate phone (optional)
    if (data.phone && data.phone.trim() && data.phone.trim().length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    
    return errors;
  }
  
  /**
   * Check if email is already registered
   */
  static async isEmailRegistered(email: string): Promise<{ exists: boolean; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .limit(1);
      
      if (error) {
        console.error('Email check error:', error);
        return { exists: false, error: error.message };
      }
      
      return { exists: (data && data.length > 0) };
    } catch (error) {
      console.error('Email registration check error:', error);
      return { 
        exists: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Get users with the same name for duplicate checking
   */
  static async getUsersByName(firstName: string, lastName: string): Promise<{
    users: UserDisplayInfo[];
    context: DuplicateNameContext;
    error?: string;
  }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }
      
      const { data, error } = await supabase
        .rpc('get_users_by_name', {
          p_first_name: firstName.trim(),
          p_last_name: lastName.trim()
        });
      
      if (error) {
        console.error('Get users by name error:', error);
        return { 
          users: [], 
          context: { has_duplicates: false, total_count: 0, disambiguation_method: 'email_prefix' },
          error: error.message 
        };
      }
      
      const users = data || [];
      const context: DuplicateNameContext = {
        has_duplicates: users.length > 1,
        total_count: users.length,
        disambiguation_method: users.length > 1 ? 'email_prefix' : 'email_prefix'
      };
      
      return { users, context };
    } catch (error) {
      console.error('Get users by name error:', error);
      return { 
        users: [], 
        context: { has_duplicates: false, total_count: 0, disambiguation_method: 'email_prefix' },
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Register new user with comprehensive validation
   */
  static async registerUser(
    userId: string,
    registrationData: UserRegistrationData
  ): Promise<RegistrationResponse> {
    try {
      // Validate input data
      const validationErrors = this.validateRegistrationData(registrationData);
      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          error: 'INVALID_NAME',
          message: `Validation failed: ${Object.values(validationErrors).join(', ')}`
        };
      }
      
      if (!supabase) {
        // Demo mode response
        return {
          success: true,
          profile_id: 'demo-profile-id',
          user_id: userId,
          full_name: `${registrationData.first_name} ${registrationData.last_name}`,
          email: registrationData.email,
          is_duplicate_name: false,
          message: 'Demo mode: User registration simulated'
        };
      }
      
      // Use safe registration RPC function
      const { data, error } = await supabase
        .rpc('safe_register_user', {
          p_user_id: userId,
          p_first_name: registrationData.first_name,
          p_last_name: registrationData.last_name,
          p_email: registrationData.email,
          p_phone: registrationData.phone,
          p_birth_date: registrationData.birth_date,
          p_birth_time: registrationData.birth_time,
          p_birth_place: registrationData.birth_place
        });
      
      if (error) {
        console.error('Registration RPC error:', error);
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: `Registration failed: ${error.message}`
        };
      }
      
      return data as RegistrationResponse;
      
    } catch (error) {
      console.error('User registration error:', error);
      return {
        success: false,
        error: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Unknown registration error'
      };
    }
  }
  
  /**
   * Update existing user profile
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<UserRegistrationData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: true }; // Demo mode
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Profile update error:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Get user profile by user ID
   */
  static async getUserProfile(userId: string): Promise<{
    profile: UserProfile | null;
    error?: string;
  }> {
    try {
      if (!supabase) {
        return { profile: null, error: 'Supabase not configured' };
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return { profile: null }; // No profile found
        }
        console.error('Get profile error:', error);
        return { profile: null, error: error.message };
      }
      
      return { profile: data };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        profile: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Generate display name for users with potential duplicates
   */
  static generateDisplayName(
    firstName: string,
    lastName: string,
    email: string,
    isDuplicate: boolean = false
  ): string {
    const fullName = `${firstName} ${lastName}`;
    
    if (!isDuplicate) {
      return fullName;
    }
    
    // Extract username from email for disambiguation
    const emailPrefix = email.split('@')[0];
    return `${fullName} (${emailPrefix})`;
  }
  
  /**
   * Search users by name with disambiguation
   */
  static async searchUsersByName(
    searchTerm: string,
    limit: number = 10
  ): Promise<{ users: UserDisplayInfo[]; error?: string }> {
    try {
      if (!supabase) {
        return { users: [] };
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, first_name, last_name, email, created_at')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .eq('status', 'active')
        .order('created_at', { ascending: true })
        .limit(limit);
      
      if (error) {
        console.error('Search users error:', error);
        return { users: [], error: error.message };
      }
      
      // Process results to add display names
      const users: UserDisplayInfo[] = (data || []).map(user => {
        // Check if there are other users with the same name
        const duplicateCount = data.filter(u => 
          u.first_name.toLowerCase() === user.first_name.toLowerCase() && 
          u.last_name.toLowerCase() === user.last_name.toLowerCase()
        ).length;
        
        return {
          ...user,
          display_name: this.generateDisplayName(
            user.first_name,
            user.last_name,
            user.email,
            duplicateCount > 1
          )
        };
      });
      
      return { users };
    } catch (error) {
      console.error('Search users error:', error);
      return {
        users: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Error message mapping for user-friendly display
 */
export const getRegistrationErrorMessage = (error: RegistrationError): string => {
  const errorMessages: Record<RegistrationError, string> = {
    EMAIL_EXISTS: 'This email address is already registered. Please use a different email or try logging in.',
    USER_ID_EXISTS: 'A profile already exists for this user account.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_NAME: 'Please enter valid first and last names.',
    CONSTRAINT_VIOLATION: 'Registration failed due to data constraints. Please check your information.',
    UNKNOWN_ERROR: 'An unexpected error occurred during registration. Please try again.'
  };
  
  return errorMessages[error] || errorMessages.UNKNOWN_ERROR;
};

/**
 * Utility functions for UI components
 */
export const UserRegistrationUtils = {
  /**
   * Format display name for UI lists
   */
  formatUserDisplayName: (user: UserDisplayInfo): string => {
    return user.display_name;
  },
  
  /**
   * Get initials for avatar display
   */
  getUserInitials: (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  },
  
  /**
   * Check if user has duplicate name context
   */
  hasDuplicateName: (context: DuplicateNameContext): boolean => {
    return context.has_duplicates;
  },
  
  /**
   * Generate unique identifier for duplicate users
   */
  generateUniqueIdentifier: (email: string, createdAt: string): string => {
    const emailPrefix = email.split('@')[0];
    const date = new Date(createdAt).toLocaleDateString();
    return `${emailPrefix} (${date})`;
  }
};