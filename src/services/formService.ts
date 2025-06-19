import { FormTemplate, FormElement, PaginatedApiResponse } from '../types/formTypes';
import { Category } from '../types/api';
import api from '../lib/axios';
import * as categoryService from './categoryService';
import { AxiosError } from 'axios';
// import { v4 as uuidv4 } from 'uuid';

interface FormSubmission {
  id: string;
  template_id: string;
  order_id: string| null;
  customer_id: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  values: Record<string, unknown>;
  // values: string;
}

interface FormSequence {
  id: string;
  templates: FormTemplate[];
  currentIndex: number;
  totalSteps: number;
  data: Record<string, unknown>;
}

interface BulkUpdateElement extends Omit<FormElement, 'created_at' | 'updated_at'> {
  order: number;
}

interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// Form Categories
export const getFormCategories = async (): Promise<Category[]> => {
  return categoryService.getCategoriesByType('product');
};

export const getFormCategory = async (id: string): Promise<Category | null> => {
  const category = await categoryService.getCategory(id);
  if (category?.type !== 'product') {
    return null;
  }
  return category;
};

export const getFormCategoryTemplates = async (id: string) => {
  return categoryService.getCategoryTemplates(id);
};

// Form Templates
export const getFormTemplates = async (page = 1): Promise<PaginatedApiResponse<FormTemplate>> => {
  const response = await api.get(`/form-templates`, {
    params: { page }
  });
  return response.data;
};

export const createFormTemplate = async (template: Omit<FormTemplate, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
  const response = await api.post(`/form-templates`, template);
  return response.data;
};

export const getFormElementsByTemplateId = async (templateId: string): Promise<FormElement[]> => {
  try {
    //console.log('Fetching elements for template:', templateId);
    const response = await api.get(`/form-elements`, {
      params: { 
        template_id: templateId,
        per_page: 100 // Get more elements per page
      }
    });
    
    //console.log('Elements response:', response.data);
    
    // Extract elements from response
    const elements = response.data.data || response.data || [];
    
    // Sort elements by order
    const sortedElements = elements.sort((a: FormElement, b: FormElement) => a.order - b.order);
    //console.log('Sorted elements:', sortedElements);
    
    return sortedElements;
  } catch (error) {
    console.error('Error fetching form elements:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
};

export const getFormTemplate = async (id: string): Promise<FormTemplate> => {
  try {
    // First get the template
    const templateResponse = await api.get(`/form-templates/${id}`);
    console.log('template:', templateResponse);
    
      // console.log('Raw template response:', {
      //   status: templateResponse.status,
      //   data: templateResponse.data
      // });
    
    // Extract data from the wrapped response
    const templateData = templateResponse.data.data;
    
    if (!templateData) {
      console.error('No template data received');
      throw new Error('No template data received');
    }

    
    // Get form elements from the dedicated endpoint
    const elementsResponse = await api.get(`/form-templates/${templateData.id}/elements`);
    const elements = elementsResponse.data.data?.map((element: FormElement) => ({
      ...element
    })) || [];

    // const elements = templateData.elements?.map((element: FormElement) => {
    //   // console.log('Element:', element);
    //   return {
    //     ...element
    //   };
    // }) || [];
    // The elements are now included in the response, no need for separate call
    const template: FormTemplate = {
      id: templateData.id,
      name: templateData.name,
      description: templateData.description,
      category_id: templateData.category_id,
      category: templateData.category,
      elements: elements.sort((a: FormElement, b: FormElement) => a.order - b.order),
      created_at: templateData.created_at,
      updated_at: templateData.updated_at,
    };
    
    // console.log('Processed template elements:', elements.map((e: FormElement) => ({
    //   id: e.id,
    //   type: e.type,
    //   label: e.label
    // })));
    
    return template;
  } catch (error) {
    console.error('Error in getFormTemplate:', error);
    throw error;
  }
};

export const updateFormTemplate = async (id: string, template: Partial<Omit<FormTemplate, 'category'>>) => {
  // Only send the minimal required fields for template update
  const templateUpdateData = {
    name: template.name || '',
    description: template.description || '',
    category_id: template.category_id || '',
  };
  
  //console.log('Sending template update data:', templateUpdateData);
  
  // Update template first
  const templateResponse = await api.put(`/form-templates/${id}`, templateUpdateData);
  
  // If we have elements, handle them separately after template update succeeds
  if (template.elements && template.elements.length > 0) {
    //console.log('Will handle elements update separately');
  }

  return templateResponse.data;
};

export const deleteFormTemplate = async (id: string) => {
  const response = await api.delete(`/form-templates/${id}`);
  return response.data;
};

// Form Elements
export const getFormElements = async (page = 1): Promise<PaginatedApiResponse<FormElement>> => {
  const response = await api.get(`/form-elements`, {
    params: { page }
  });
  
  // If response doesn't have pagination metadata, create a default structure
  if (!response.data.meta || !response.data.meta.last_page) {
    const data = Array.isArray(response.data) ? response.data : response.data.data || [];
    return {
      data,
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [],
        path: '/form-elements',
        per_page: data.length,
        to: data.length,
        total: data.length
      },
      links: {
        first: '',
        last: '',
        prev: null,
        next: null
      }
    };
  }
  
  return response.data;
};

export const createFormElement = async (element: Omit<FormElement, 'id' | 'created_at' | 'updated_at' | 'template'>) => {
  console.log('Creating form element:', element);
  const response = await api.post(`/form-templates/${element.template_id}/elements`, element);
  console.log('Form element created from API service:', response.data);
  return response.data;
};

export const updateFormElement = async (id: string, element: Partial<Omit<FormElement, 'template'>>) => {
  console.log('Updating form element:', { id, element });
  const response = await api.put(`/form-elements/${id}`, element);
  return response.data;
};

export const deleteFormElement = async (id: string) => {
  const response = await api.delete(`/form-elements/${id}`);
  return response.data;
};

export const bulkCreateFormElements = async (templateId: string, elements: BulkUpdateElement[]) => {
  //console.log('Sending bulk elements update:', elements);
  const response = await api.put(
    `/form-templates/${templateId}/elements/bulk`,
    { elements }
  );
  return response.data;
};

// Form Submissions
export const getFormSubmissions = async (page = 1): Promise<PaginatedApiResponse<FormSubmission>> => {
  const response = await api.get(`/form-submissions`, {
    params: { page }
  });
  return response.data;
};

export const createFormSubmission = async (submission: Omit<FormSubmission, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post(`/form-submissions`, submission);
  return response.data;
};

export const getFormSubmission = async (id: string): Promise<FormSubmission> => {
  const response = await api.get(`/form-submissions/${id}`);
  return response.data;
};

export const updateFormSubmission = async (id: string, submission: Partial<FormSubmission>) => {
  const response = await api.put(`/form-submissions/${id}`, submission);
  return response.data;
};

export const deleteFormSubmission = async (id: string) => {
  const response = await api.delete(`/form-submissions/${id}`);
  return response.data;
};

export const getFormSubmissionValues = async (submissionId: string): Promise<Record<string, unknown>> => {
  const response = await api.get(`/form-submissions/${submissionId}/values`);
  return response.data;
};

export const createFormSubmissionValues = async (submissionId: string, values: Record<string, unknown>) => {
  const response = await api.post(
    `/form-submissions/${submissionId}/values`,
    values
  );
  return response.data;
};

// Form Sequences
export const getFormSequences = async (page = 1): Promise<PaginatedApiResponse<FormSequence>> => {
  const response = await api.get(`/form-sequences`, {
    params: { page }
  });
  return response.data;
};

export const createFormSequence = async (sequence: Omit<FormSequence, 'id'>) => {
  const response = await api.post(`/form-sequences`, sequence);
  return response.data;
};

export const getFormSequence = async (sessionId: string): Promise<FormSequence> => {
  const response = await api.get(`/form-sequences/${sessionId}`);
  return response.data;
};

export const updateFormSequence = async (sessionId: string, sequence: Partial<FormSequence>) => {
  const response = await api.put(`/form-sequences/${sessionId}`, sequence);
  return response.data;
};

export const deleteFormSequence = async (sessionId: string) => {
  const response = await api.delete(`/form-sequences/${sessionId}`);
  return response.data;
};

export const reorderFormElements = async (templateId: string, elements: string[]) => {
  // Validate input data first
  if (!elements?.length) {
    throw new Error('Tidak ada elemen untuk diurutkan');
  }

  const payload = {
    ids: elements
  };

  // Debug log untuk melihat data yang akan dikirim
  console.log('Debug - Reorder request payload:', {
    templateId,
    payload
  });

  try {
    const response = await api.put(
      `/form-templates/${templateId}/elements/reorder`, 
      payload
    );
    console.log('Reorder success response:', {
      status: response.status,
      data: response.data
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Log detailed error information
      const errorResponse = error.response?.data as LaravelValidationError;
      
      console.group('Reorder API Error Details');
      console.log('Status:', error.response?.status);
      console.log('Status Text:', error.response?.statusText);
      console.log('Error Message:', error.message);
      
      if (errorResponse) {
        console.group('Validation Errors');
        console.log('Message:', errorResponse.message);
        if (errorResponse.errors) {
          console.log('Field Errors:');
          Object.entries(errorResponse.errors).forEach(([field, messages]) => {
            console.log(`  ${field}:`, messages);
          });
        }
        console.log('Raw Error Response:', JSON.stringify(errorResponse, null, 2));
        console.groupEnd();
      }
      
      console.log('Request Config:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data ? JSON.parse(error.config.data) : undefined
      });
      console.groupEnd();

      // If we have validation errors from Laravel, throw with specific message
      if (error.response?.status === 422 && errorResponse) {
        // Get first validation error message or fallback to default
        const firstErrorMessage = Object.values(errorResponse.errors || {})
          .flat()
          .find(message => message) || errorResponse.message;

        throw new Error(firstErrorMessage || 'Data tidak valid untuk pengurutan elemen');
      }

      // For other error types, throw with appropriate message
      throw new Error(error.response?.data?.message || error.message || 'Gagal mengubah urutan elemen');
    }

    // For non-AxiosError, just log and rethrow
    console.error('Unexpected error during reorder:', error);
    throw error;
  }
};

export const bulkUpdateFormElements = async (templateId: string, elements: BulkUpdateElement[]) => {
  console.log('Sending bulk update request:', {
    url: `/form-templates/${templateId}/elements/bulk`,
    payload: { elements }
  });
  try {
    const response = await api.put(
      `/form-templates/${templateId}/elements/bulk`,
      { elements }
    );
    console.log('Bulk update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Bulk update API error:', {
      endpoint: `/form-templates/${templateId}/elements/bulk`,
      templateId,
      payload: { elements },
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error
    });
    throw error;
  }
}; 