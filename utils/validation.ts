export class ValidationService {
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, error: 'E-posta adresi gereklidir' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Geçerli bir e-posta adresi girin' };
    }
    
    return { isValid: true };
  }

  static validateFullName(fullName: string): { isValid: boolean; error?: string } {
    if (!fullName || fullName.trim().length < 2) {
      return { isValid: false, error: 'İsim ve soyisim en az 2 karakter olmalı' };
    }
    
    return { isValid: true };
  }

  static validatePhone(phone: string): { isValid: boolean; error?: string } {
    // Phone is optional, so empty is valid
    if (!phone || phone.trim().length === 0) {
      return { isValid: true };
    }
    
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      return { isValid: false, error: 'Telefon numarası en az 10 rakam olmalı' };
    }
    
    if (digitsOnly.length > 15) {
      return { isValid: false, error: 'Telefon numarası çok uzun' };
    }
    
    // Check for valid phone pattern (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, error: 'Geçerli bir telefon numarası girin' };
    }
    
    return { isValid: true };
  }

  static validateBirthPlace(birthPlace: string): { isValid: boolean; error?: string } {
    if (!birthPlace || birthPlace.trim().length < 2) {
      return { isValid: false, error: 'Doğum yeri en az 2 karakter olmalı' };
    }
    
    return { isValid: true };
  }

  static validateBirthDate(birthDate: Date): { isValid: boolean; error?: string } {
    const now = new Date();
    const oneHundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    
    if (birthDate > now) {
      return { isValid: false, error: 'Doğum tarihi gelecekte olamaz' };
    }
    
    if (birthDate < oneHundredYearsAgo) {
      return { isValid: false, error: 'Doğum tarihi çok eski' };
    }
    
    return { isValid: true };
  }

  static validateBirthTime(birthTime: Date): { isValid: boolean; error?: string } {
    // Basic validation - time should be valid
    if (!birthTime || isNaN(birthTime.getTime())) {
      return { isValid: false, error: 'Geçerli bir doğum saati girin' };
    }
    
    return { isValid: true };
  }
}