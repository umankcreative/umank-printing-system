export interface FormElement {
  id: string;
  template_id: string;
  type: FormElementType;
  label: string;
  placeholder: string | null;
  required: boolean;
  default_value: string | null;
  validation_pattern: string | null;
  validation_message: string | null;
  file_accept: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  template?: FormTemplate;
  options: FormElementOption[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category?: Category;
  created_at: string;
  updated_at: string;
  elements?: FormElement[];
}

export interface FormElementOption {
  label: string;
  value: string;
}

export type FormElementType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date' | 'file' | 'email' | 'phone';

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
  [templateId: string]: Record<string, unknown>;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}
