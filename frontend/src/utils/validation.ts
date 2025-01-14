// Email validation regex
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Password validation rules
export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 32,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
};

// Validation functions
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  
  if (password.length < PASSWORD_RULES.minLength) {
    return `Password must be at least ${PASSWORD_RULES.minLength} characters`;
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    return `Password must be less than ${PASSWORD_RULES.maxLength} characters`;
  }

  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  if (PASSWORD_RULES.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }

  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

// Credit card validation
export const validateCreditCard = (cardNumber: string): string | null => {
  // Remove non-digit characters
  const cleanedNumber = cardNumber.replace(/\D/g, '');

  // Luhn algorithm for card validation
  let sum = 0;
  let isEven = false;

  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (cleanedNumber.length < 12 || cleanedNumber.length > 19) {
    return 'Invalid card number length';
  }

  return sum % 10 === 0 ? null : 'Invalid card number';
};

// Zip code validation (US format)
export const validateZipCode = (zipCode: string): string | null => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipCode) return 'Zip code is required';
  if (!zipRegex.test(zipCode)) return 'Invalid zip code format';
  return null;
};
