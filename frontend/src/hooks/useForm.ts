import { useState } from 'react';

type Validator = (value: string) => string | null;

interface FormField {
  value: string;
  error: string | null;
}

interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]: string | null };
  handleChange: (field: keyof T, value: string) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
}

export function useForm<T extends { [key: string]: string }>(
  initialValues: T, 
  validators: { [K in keyof T]?: Validator } = {}
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]: string | null }>(() => 
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = null;
      return acc;
    }, {} as { [K in keyof T]: string | null })
  );

  const handleChange = (field: keyof T, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateField = (field: keyof T): boolean => {
    const validator = validators[field];
    if (!validator) return true;

    const error = validator(values[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(validators).forEach(key => {
      const field = key as keyof T;
      const validator = validators[field];
      
      if (validator) {
        const error = validator(values[field]);
        newErrors[field] = error;
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors(
      Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = null;
        return acc;
      }, {} as { [K in keyof T]: string | null })
    );
  };

  return {
    values,
    errors,
    handleChange,
    validateField,
    validateForm,
    resetForm
  };
}
