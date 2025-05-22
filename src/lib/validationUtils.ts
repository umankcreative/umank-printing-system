
import { FormElement } from '../types/formTypes';

export const getValidationPattern = (element: FormElement) => {
  if (element.validation?.pattern) {
    // If the pattern is a string that looks like a regex (starts and ends with /)
    if (typeof element.validation.pattern === 'string' && 
        element.validation.pattern.startsWith('/') && 
        element.validation.pattern.lastIndexOf('/') > 0) {
      
      const patternStr = element.validation.pattern;
      const lastSlashIndex = patternStr.lastIndexOf('/');
      const pattern = patternStr.substring(1, lastSlashIndex);
      const flags = patternStr.substring(lastSlashIndex + 1);
      
      return new RegExp(pattern, flags);
    }
    
    return element.validation.pattern as RegExp;
  }
  
  // Default patterns based on type
  if (element.type === 'email') {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  }
  
  if (element.type === 'phone') {
    return /^(?:\+62|62|0)[2-9]\d{7,11}$/;
  }
  
  return new RegExp('.*');
};

export const getValidationMessage = (element: FormElement) => {
  if (element.validation?.message) {
    return element.validation.message;
  }
  
  // Default messages based on type
  if (element.type === 'email') {
    return 'Format email tidak valid';
  }
  
  if (element.type === 'phone') {
    return 'Format nomor handphone Indonesia tidak valid (contoh: 08123456789)';
  }
  
  return 'Field ini tidak valid';
};
