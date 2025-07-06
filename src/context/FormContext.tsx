import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormCategoryMapping, FormElement, FormTemplate } from '../types/formTypes';
import { Category} from '../types/api';
import { toast } from '../hooks/use-toast';
import * as formService from '../services/formService';

interface FormContextType {
  formTemplates: FormTemplate[];
  formCategoryMappings: FormCategoryMapping[];
  activeTemplate: FormTemplate | null;
  isLoading: boolean;
  error: string | null;
  currentElementPage: number;
  setCurrentElementPage: (page: number) => void;
  setActiveTemplate: (template: FormTemplate | null) => void;
  addFormTemplate: (template: Omit<FormTemplate, 'id' | 'created_at' | 'updated_at' | 'category'>) => Promise<void>;
  updateFormTemplate: (template: Partial<Omit<FormTemplate, 'category'>>) => Promise<void>;
  deleteFormTemplate: (templateId: string) => Promise<void>;
  updateFormElement: (templateId: string, element: Partial<Omit<FormElement, 'template'>>) => Promise<void>;
  addFormElement: (templateId: string, element: Omit<FormElement, 'id' | 'created_at' | 'updated_at' | 'template'>) => Promise<void>;
  deleteFormElement: (templateId: string, elementId: string) => Promise<void>;
  updateCategoryMapping: (mapping: FormCategoryMapping) => Promise<void>;
  getFormTemplateForCategory: (categoryId: string) => FormTemplate | null;
  refreshData: () => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [formCategoryMappings, setFormCategoryMappings] = useState<FormCategoryMapping[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<FormTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentElementPage, setCurrentElementPage] = useState(1);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First fetch templates and categories
      const [templatesResponse, categories] = await Promise.all([
        formService.getFormTemplates(),
        formService.getFormCategories(),
      ]);

      // Create category mappings from the categories data
      const mappings: FormCategoryMapping[] = categories.map((category: Category) => {
        const template = templatesResponse.data.find((t: FormTemplate) => t.category_id === category.id);
        return {
          categoryId: category.id,
          categoryName: category.name,
          formTemplateId: template?.id || ''
        };
      });

      // Templates already include their elements, no need for separate elements fetch
      setFormTemplates(templatesResponse.data);
      setFormCategoryMappings(mappings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
      setError(errorMessage);
      console.error(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentElementPage]); // Only refresh when element page changes

  const addFormTemplate = async (template: Omit<FormTemplate, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    try {
      const newTemplate = await formService.createFormTemplate(template);
      setFormTemplates([...formTemplates, newTemplate]);
      toast({
        title: 'Template Berhasil Dibuat',
        description: `Template "${newTemplate.name}" telah berhasil dibuat.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateFormTemplate = async (template: Partial<Omit<FormTemplate, 'category'>>) => {
    try {
      if (!template.id) throw new Error('Template ID is required');
      
      // Only send the minimal required fields for update
      const updateData = {
        name: template.name || '',
        description: template.description || '',
        category_id: template.category_id || '',
      };
      
      console.log('FormContext sending update data:', updateData);
      
      const updatedTemplate = await formService.updateFormTemplate(template.id, updateData);
      
      // Update the templates list with the new data, preserving existing elements
      setFormTemplates(
        formTemplates.map((t) => {
          if (t.id === template.id) {
            return {
              ...t,
              ...updatedTemplate,
              elements: t.elements || [], // Preserve existing elements
            };
          }
          return t;
        })
      );
      
      // If we have elements, we'll handle them in a separate update
      if (template.elements?.length) {
        console.log('Will handle elements update in a separate call');
      }
      
      toast({
        title: 'Template Berhasil Diperbarui',
        description: `Template "${template.name || ''}" telah berhasil diperbarui.`,
      });
    } catch (err) {
      console.error('Error updating template:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteFormTemplate = async (templateId: string) => {
    try {
      await formService.deleteFormTemplate(templateId);
      const template = formTemplates.find(t => t.id === templateId);
      setFormTemplates(formTemplates.filter((t) => t.id !== templateId));
      setFormCategoryMappings(
        formCategoryMappings.map((m) =>
          m.formTemplateId === templateId ? { ...m, formTemplateId: '' } : m
        )
      );
      if (template) {
        toast({
          title: 'Template Berhasil Dihapus',
          description: `Template "${template.name}" telah berhasil dihapus.`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateFormElement = async (templateId: string, element: Partial<Omit<FormElement, 'template'>>) => {
    try {
      if (!element.id) throw new Error('Element ID is required');
      const updatedElement = await formService.updateFormElement(element.id, element);
      setFormTemplates(
        formTemplates.map((t) => {
          if (t.id === templateId) {
            return {
              ...t,
              elements: t.elements?.map((e) =>
                e.id === element.id ? { ...e, ...updatedElement } : e
              ) || []
            };
          }
          return t;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update element';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const addFormElement = async (templateId: string, element: Omit<FormElement, 'id' | 'created_at' | 'updated_at' | 'template'>) => {
    try {
      const newElement = await formService.createFormElement({
        ...element,
        template_id: templateId
      });
      setFormTemplates(
        formTemplates.map((t) => {
          if (t.id === templateId) {
            return {
              ...t,
              elements: [...(t.elements || []), newElement],
            };
          }
          return t;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add element';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteFormElement = async (templateId: string, elementId: string) => {
    try {
      await formService.deleteFormElement(elementId);
      setFormTemplates(
        formTemplates.map((t) => {
          if (t.id === templateId) {
            return {
              ...t,
              elements: t.elements?.filter((e) => e.id !== elementId) || []
            };
          }
          return t;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete element';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCategoryMapping = async (mapping: FormCategoryMapping) => {
    try {
      // Update the mapping in the state
      setFormCategoryMappings(
        formCategoryMappings.map((m) =>
          m.categoryId === mapping.categoryId ? mapping : m
        )
      );

      // If there's a template ID, update the template's categoryId
      if (mapping.formTemplateId) {
        const template = formTemplates.find(t => t.id === mapping.formTemplateId);
        if (template) {
          const updatedTemplate = {
            ...template,
            category_id: mapping.categoryId
          };
          await updateFormTemplate(updatedTemplate);
        }
      }

      toast({
        title: 'Kategori Berhasil Diperbarui',
        description: `Kategori "${mapping.categoryName}" telah berhasil diperbarui.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category mapping';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const getFormTemplateForCategory = (categoryId: string): FormTemplate | null => {
    const mapping = formCategoryMappings.find(
      (m) => m.categoryId === categoryId
    );
    if (!mapping || !mapping.formTemplateId) return null;
    
    return formTemplates.find((t) => t.id === mapping.formTemplateId) || null;
  };

  return (
    <FormContext.Provider
      value={{
        formTemplates,
        formCategoryMappings,
        activeTemplate,
        isLoading,
        error,
        currentElementPage,
        setCurrentElementPage,
        setActiveTemplate,
        addFormTemplate,
        updateFormTemplate,
        deleteFormTemplate,
        updateFormElement,
        addFormElement,
        deleteFormElement,
        updateCategoryMapping,
        getFormTemplateForCategory,
        refreshData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
