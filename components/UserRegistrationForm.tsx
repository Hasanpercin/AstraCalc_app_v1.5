import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { User, Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react-native';
import { UserRegistrationService, getRegistrationErrorMessage } from '@/services/userRegistrationService';
import { UserRegistrationData, ValidationErrors } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';

interface UserRegistrationFormProps {
  onRegistrationSuccess?: (userId: string) => void;
  onRegistrationError?: (error: string) => void;
}

export default function UserRegistrationForm({
  onRegistrationSuccess,
  onRegistrationError
}: UserRegistrationFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [registrationData, setRegistrationData] = useState<UserRegistrationData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    birth_time: '',
    birth_place: ''
  });

  /**
   * Real-time validation as user types
   */
  const validateField = (field: keyof UserRegistrationData, value: string) => {
    const tempData = { ...registrationData, [field]: value };
    const errors = UserRegistrationService.validateRegistrationData(tempData);
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: errors[field]
    }));
  };

  /**
   * Handle input changes with validation
   */
  const handleInputChange = (field: keyof UserRegistrationData, value: string) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Validate on blur (debounced validation could be added here)
    setTimeout(() => validateField(field, value), 500);
  };

  /**
   * Check for email duplicates
   */
  const checkEmailAvailability = async (email: string) => {
    if (!email || validationErrors.email) return;
    
    const result = await UserRegistrationService.isEmailRegistered(email);
    if (result.exists) {
      setValidationErrors(prev => ({
        ...prev,
        email: 'This email address is already registered'
      }));
    } else if (result.error) {
      console.warn('Email check failed:', result.error);
    }
  };

  /**
   * Preview duplicate name situation
   */
  const checkNameDuplicates = async (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return;
    
    const result = await UserRegistrationService.getUsersByName(firstName, lastName);
    if (result.context.has_duplicates) {
      Alert.alert(
        'Name Already Exists',
        `There ${result.context.total_count === 1 ? 'is' : 'are'} ${result.context.total_count} other user${result.context.total_count === 1 ? '' : 's'} with the name "${firstName} ${lastName}". Your account will be distinguished by your email address.`,
        [{ text: 'Understood', style: 'default' }]
      );
    }
  };

  /**
   * Handle registration submission
   */
  const handleRegistration = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to complete registration');
      return;
    }

    // Final validation
    const errors = UserRegistrationService.validateRegistrationData(registrationData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Alert.alert('Validation Error', 'Please fix the errors below before continuing');
      return;
    }

    setLoading(true);
    
    try {
      const result = await UserRegistrationService.registerUser(user.id, registrationData);
      
      if (result.success) {
        let successMessage = 'Registration completed successfully!';
        
        if (result.is_duplicate_name) {
          successMessage += `\n\nNote: There are other users with the same name. Your account will be displayed as "${result.full_name}" with your email prefix for identification.`;
        }
        
        Alert.alert(
          'Registration Successful',
          successMessage,
          [
            {
              text: 'Continue',
              onPress: () => onRegistrationSuccess?.(user.id)
            }
          ]
        );
      } else {
        const errorMessage = result.error ? 
          getRegistrationErrorMessage(result.error) : 
          result.message;
        
        Alert.alert('Registration Failed', errorMessage);
        onRegistrationError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Registration Error', errorMessage);
      onRegistrationError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide your information to create your personalized astrology profile
        </Text>
      </View>

      {/* First Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <View style={[styles.inputContainer, validationErrors.first_name && styles.inputError]}>
          <User size={20} color="#8B5CF6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={registrationData.first_name}
            onChangeText={(value) => handleInputChange('first_name', value)}
            onBlur={() => {
              if (registrationData.first_name && registrationData.last_name) {
                checkNameDuplicates(registrationData.first_name, registrationData.last_name);
              }
            }}
            placeholder="Enter your first name"
            placeholderTextColor="#64748B"
            autoCapitalize="words"
          />
        </View>
        {validationErrors.first_name && (
          <Text style={styles.errorText}>{validationErrors.first_name}</Text>
        )}
      </View>

      {/* Last Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <View style={[styles.inputContainer, validationErrors.last_name && styles.inputError]}>
          <User size={20} color="#8B5CF6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={registrationData.last_name}
            onChangeText={(value) => handleInputChange('last_name', value)}
            onBlur={() => {
              if (registrationData.first_name && registrationData.last_name) {
                checkNameDuplicates(registrationData.first_name, registrationData.last_name);
              }
            }}
            placeholder="Enter your last name"
            placeholderTextColor="#64748B"
            autoCapitalize="words"
          />
        </View>
        {validationErrors.last_name && (
          <Text style={styles.errorText}>{validationErrors.last_name}</Text>
        )}
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <View style={[styles.inputContainer, validationErrors.email && styles.inputError]}>
          <Mail size={20} color="#8B5CF6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={registrationData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            onBlur={() => checkEmailAvailability(registrationData.email)}
            placeholder="Enter your email address"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {validationErrors.email && (
          <Text style={styles.errorText}>{validationErrors.email}</Text>
        )}
      </View>

      {/* Phone (Optional) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={[styles.inputContainer, validationErrors.phone && styles.inputError]}>
          <Phone size={20} color="#8B5CF6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={registrationData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Enter your phone number (optional)"
            placeholderTextColor="#64748B"
            keyboardType="phone-pad"
          />
        </View>
        {validationErrors.phone && (
          <Text style={styles.errorText}>{validationErrors.phone}</Text>
        )}
      </View>

      {/* Birth Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Birth Information (Optional)</Text>
        <Text style={styles.sectionSubtitle}>
          Required for personalized astrology readings
        </Text>
      </View>

      {/* Birth Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birth Date</Text>
        <View style={styles.inputContainer}>
          <Calendar size={20} color="#8B5CF6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={registrationData.birth_date}
            onChangeText={(value) => handleInputChange('birth_date', value)}
            placeholder="DD-MM-YYYY (e.g., 15-01-1990)"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      {/* Birth Time */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birth Time</Text>
        <View style={styles.inputContainer}>
          <Clock size={20} color="#8B5CF6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={registrationData.birth_time}
            onChangeText={(value) => handleInputChange('birth_time', value)}
            placeholder="HH:MM (e.g., 14:30)"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      {/* Birth Place */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birth Place</Text>
        <View style={styles.inputContainer}>
          <MapPin size={20} color="#8B5CF6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={registrationData.birth_place}
            onChangeText={(value) => handleInputChange('birth_place', value)}
            placeholder="City, Country (e.g., Istanbul, Turkey)"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      {/* Registration Button */}
      <TouchableOpacity
        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
        onPress={handleRegistration}
        disabled={loading}
      >
        <Text style={styles.registerButtonText}>
          {loading ? 'Creating Profile...' : 'Complete Registration'}
        </Text>
      </TouchableOpacity>

      {/* Info Note */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          * Required fields. Your email address will be used to identify your account if multiple users share your name.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#64748B',
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#93C5FD',
    lineHeight: 20,
  },
});