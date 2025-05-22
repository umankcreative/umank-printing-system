
import { Product } from './types';

export type FormElementType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date' | 'file' | 'email' | 'phone';

export interface FormElementOption {
  label: string;
  value: string;
}

export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FormElementOption[];
  defaultValue?: string;
  fileAccept?: string; // Untuk menentukan jenis file yang diterima
  validation?: {
    pattern?: RegExp | string;
    message?: string;
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  elements: FormElement[];
  categoryId: string;
}

export interface FormCategoryMapping {
  categoryId: string;
  categoryName: string;
  formTemplateId: string;
}

export interface FormSequence {
  templates: FormTemplate[];
  currentIndex: number;
  totalSteps: number;
}

export interface FormSequenceData {
  [templateId: string]: Record<string, any>;
}
