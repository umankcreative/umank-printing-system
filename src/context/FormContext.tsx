
import React, { createContext, useContext, useState } from 'react';
import { FormCategoryMapping, FormElement, FormTemplate } from '../types/formTypes';
import { formTemplates as initialFormTemplates, formCategoryMappings as initialFormCategoryMappings } from '../data/formTemplates';
import { toast } from '../hooks/use-toast';

interface FormContextType {
  formTemplates: FormTemplate[];
  formCategoryMappings: FormCategoryMapping[];
  activeTemplate: FormTemplate | null;
  setActiveTemplate: (template: FormTemplate | null) => void;
  addFormTemplate: (template: FormTemplate) => void;
  updateFormTemplate: (template: FormTemplate) => void;
  deleteFormTemplate: (templateId: string) => void;
  updateFormElement: (templateId: string, element: FormElement) => void;
  addFormElement: (templateId: string, element: FormElement) => void;
  deleteFormElement: (templateId: string, elementId: string) => void;
  updateCategoryMapping: (mapping: FormCategoryMapping) => void;
  getFormTemplateForCategory: (categoryId: string) => FormTemplate | null;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>(initialFormTemplates);
  const [formCategoryMappings, setFormCategoryMappings] = useState<FormCategoryMapping[]>(
    initialFormCategoryMappings
  );
  const [activeTemplate, setActiveTemplate] = useState<FormTemplate | null>(null);

  const addFormTemplate = (template: FormTemplate) => {
    setFormTemplates([...formTemplates, template]);
    toast({
      title: "Template Berhasil Dibuat",
      description: `Template "${template.name}" telah berhasil dibuat.`
    });
  };

  const updateFormTemplate = (template: FormTemplate) => {
    setFormTemplates(
      formTemplates.map((t) => (t.id === template.id ? template : t))
    );
    toast({
      title: "Template Berhasil Diperbarui",
      description: `Template "${template.name}" telah berhasil diperbarui.`
    });
  };

  const deleteFormTemplate = (templateId: string) => {
    const template = formTemplates.find(t => t.id === templateId);
    if (template) {
      setFormTemplates(formTemplates.filter((t) => t.id !== templateId));
      // Reset any mappings that use this template
      setFormCategoryMappings(
        formCategoryMappings.map((m) =>
          m.formTemplateId === templateId ? { ...m, formTemplateId: '' } : m
        )
      );
      toast({
        title: "Template Berhasil Dihapus",
        description: `Template "${template.name}" telah berhasil dihapus.`
      });
    }
  };

  const updateFormElement = (templateId: string, element: FormElement) => {
    setFormTemplates(
      formTemplates.map((t) => {
        if (t.id === templateId) {
          return {
            ...t,
            elements: t.elements.map((e) =>
              e.id === element.id ? element : e
            ),
          };
        }
        return t;
      })
    );
  };

  const addFormElement = (templateId: string, element: FormElement) => {
    setFormTemplates(
      formTemplates.map((t) => {
        if (t.id === templateId) {
          return {
            ...t,
            elements: [...t.elements, element],
          };
        }
        return t;
      })
    );
  };

  const deleteFormElement = (templateId: string, elementId: string) => {
    setFormTemplates(
      formTemplates.map((t) => {
        if (t.id === templateId) {
          return {
            ...t,
            elements: t.elements.filter((e) => e.id !== elementId),
          };
        }
        return t;
      })
    );
  };

  const updateCategoryMapping = (mapping: FormCategoryMapping) => {
    setFormCategoryMappings(
      formCategoryMappings.map((m) =>
        m.categoryId === mapping.categoryId ? mapping : m
      )
    );
    toast({
      title: "Kategori Berhasil Diperbarui",
      description: `Kategori "${mapping.categoryName}" telah berhasil diperbarui.`
    });
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
        setActiveTemplate,
        addFormTemplate,
        updateFormTemplate,
        deleteFormTemplate,
        updateFormElement,
        addFormElement,
        deleteFormElement,
        updateCategoryMapping,
        getFormTemplateForCategory,
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
