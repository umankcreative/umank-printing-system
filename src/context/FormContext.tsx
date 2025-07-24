// context/FormContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import react-query
import { FormCategoryMapping, FormElement, FormTemplate } from '../types/formTypes';
import { Category } from '../types/api';
import { toast } from '../hooks/use-toast';
import * as formService from '../services/formService'; // Pastikan formService memiliki fungsi-fungsi API yang dibutuhkan

interface FormContextType {
  formTemplates: FormTemplate[];
  formCategoryMappings: FormCategoryMapping[];
  activeTemplate: FormTemplate | null;
  isLoading: boolean; // Gabungan isLoading dari templates dan mappings
  error: Error | null; // Gabungan error dari templates dan mappings
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
  // refreshData tidak perlu lagi diekspos keluar karena react-query yang menangani
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient(); // Inisialisasi queryClient

  const [activeTemplate, setActiveTemplate] = useState<FormTemplate | null>(null);
  const [currentElementPage, setCurrentElementPage] = useState(1);

  // --- useQuery untuk fetching data ---

  // Query untuk mendapatkan formTemplates dan sekaligus membuat mappings
  const {
    data: [formTemplates = [], formCategoryMappings = []] = [[], []], // Destructure dan berikan default value
    isLoading: isLoadingData, // isLoading untuk semua data
    error: dataError, // error untuk semua data
  } = useQuery<[FormTemplate[], FormCategoryMapping[]], Error>({
    queryKey: ['formTemplatesAndMappings'],
    queryFn: async () => {
      // Fetch templates dan categories secara paralel
      const [templatesResponse, categories] = await Promise.all([
        formService.getFormTemplates(),
        formService.getFormCategories(),
      ]);

      const fetchedTemplates: FormTemplate[] = templatesResponse.data;
      const fetchedCategories: Category[] = categories;

      // Buat category mappings dari data kategori
      const mappings: FormCategoryMapping[] = fetchedCategories.map((category: Category) => {
        const template = fetchedTemplates.find((t: FormTemplate) => t.category_id === category.id);
        return {
          categoryId: category.id,
          categoryName: category.name,
          formTemplateId: template?.id || ''
        };
      });

      return [fetchedTemplates, mappings];
    },
    staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
    // refetchOnWindowFocus: true, // Opsional: refetch saat jendela mendapatkan fokus kembali
    onError: (err) => {
      // Handler error level query
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
      toast({
        title: 'Error',
        description: `Gagal memuat data: ${errorMessage}`,
        variant: 'destructive',
      });
      console.error(err);
    },
  });

  const isLoading = isLoadingData; // Gunakan isLoading dari useQuery
  const error = dataError; // Gunakan error dari useQuery

  // --- useMutation untuk operasi CUD (Create, Update, Delete) ---

  // Mutasi untuk menambahkan template
  const addFormTemplateMutation = useMutation<FormTemplate, Error, Omit<FormTemplate, 'id' | 'created_at' | 'updated_at' | 'category'>>({
    mutationFn: formService.createFormTemplate,
    onSuccess: (newTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['formTemplatesAndMappings'] }); // Invalidasi cache
      toast({
        title: 'Template Berhasil Dibuat',
        description: `Template "${newTemplate.name}" telah berhasil dibuat.`,
      });
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      toast({
        title: 'Error',
        description: `Gagal membuat template: ${errorMessage}`,
        variant: 'destructive',
      });
    },
  });

  const addFormTemplate = async (template: Omit<FormTemplate, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    await addFormTemplateMutation.mutateAsync(template); // Panggil mutasi
  };

  // Mutasi untuk memperbarui template
  const updateFormTemplateMutation = useMutation<FormTemplate, Error, Partial<Omit<FormTemplate, 'category'>>>({
    mutationFn: async (template) => {
      if (!template.id) throw new Error('Template ID is required');
      const updateData = {
        name: template.name || '',
        description: template.description || '',
        category_id: template.category_id || '',
      };
      return formService.updateFormTemplate(template.id, updateData);
    },
    onSuccess: (updatedTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['formTemplatesAndMappings'] }); // Invalidasi cache
      toast({
        title: 'Template Berhasil Diperbarui',
        description: `Template "${updatedTemplate.name || ''}" telah berhasil diperbarui.`,
      });
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      toast({
        title: 'Error',
        description: `Gagal memperbarui template: ${errorMessage}`,
        variant: 'destructive',
      });
    },
  });

  const updateFormTemplate = async (template: Partial<Omit<FormTemplate, 'category'>>) => {
    await updateFormTemplateMutation.mutateAsync(template); // Panggil mutasi
  };

  // Mutasi untuk menghapus template
  const deleteFormTemplateMutation = useMutation<void, Error, string>({
    mutationFn: formService.deleteFormTemplate,
    onSuccess: (_, templateId) => {
      queryClient.invalidateQueries({ queryKey: ['formTemplatesAndMappings'] }); // Invalidasi cache
      const template = formTemplates.find(t => t.id === templateId); // Ambil dari data cache yang masih ada sebelum invalidasi
      if (template) {
        toast({
          title: 'Template Berhasil Dihapus',
          description: `Template "${template.name}" telah berhasil dihapus.`,
        });
      }
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      toast({
        title: 'Error',
        description: `Gagal menghapus template: ${errorMessage}`,
        variant: 'destructive',
      });
    },
  });

  const deleteFormTemplate = async (templateId: string) => {
    await deleteFormTemplateMutation.mutateAsync(templateId); // Panggil mutasi
  };

  // Mutasi untuk memperbarui elemen form
  const updateFormElementMutation = useMutation<FormElement, Error, { templateId: string, element: Partial<Omit<FormElement, 'template'>> }>({
    mutationFn: async ({ element }) => {
      if (!element.id) throw new Error('Element ID is required');
      return formService.updateFormElement(element.id, element);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formTemplatesAndMappings'] }); // Invalidasi cache template yang berisi elemen
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update element';
      toast({
        title: 'Error',
        description: `Gagal memperbarui elemen: ${errorMessage}`,
        variant: 'destructive',
      });
    },
  });

  const updateFormElement = async (templateId: string, element: Partial<Omit<FormElement, 'template'>>) => {
    await updateFormElementMutation.mutateAsync({ templateId, element });
  };

  // Mutasi untuk menambahkan elemen form
  const addFormElementMutation = useMutation<FormElement, Error, { templateId: string, element: Omit<FormElement, 'id' | 'created_at' | 'updated_at' | 'template'> }>({
    mutationFn: async ({ templateId, element }) => {
      return formService.createFormElement({ ...element, template_id: templateId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formTemplatesAndMappings'] }); // Invalidasi cache template yang berisi elemen
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add element';
      toast({
        title: 'Error',
        description: `Gagal menambahkan elemen: ${errorMessage}`,
        variant: 'destructive',
      });
    },
  });

  const addFormElement = async (templateId: string, element: Omit<FormElement, 'id' | 'created_at' | 'updated_at' | 'template'>) => {
    await addFormElementMutation.mutateAsync({ templateId, element });
  };

  // Mutasi untuk menghapus elemen form
  const deleteFormElementMutation = useMutation<void, Error, string>({
    mutationFn: formService.deleteFormElement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formTemplatesAndMappings'] }); // Invalidasi cache template yang berisi elemen
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete element';
      toast({
        title: 'Error',
        description: `Gagal menghapus elemen: ${errorMessage}`,
        variant: 'destructive',
      });
    },
  });

  const deleteFormElement = async (templateId: string, elementId: string) => {
    await deleteFormElementMutation.mutateAsync(elementId);
  };


  // Mutasi untuk memperbarui category mapping
  const updateCategoryMappingMutation = useMutation<any, Error, FormCategoryMapping>({
    mutationFn: async (mapping) => {
      // Asumsi API endpoint untuk update mapping adalah /form-category-mappings/{categoryId}
      // dan juga update category_id di template terkait jika formTemplateId ada.
      // Anda perlu menyesuaikan ini dengan API aktual Anda.
      
      // Jika formTemplateId di mapping tidak kosong, artinya ada template yang dipilih
      if (mapping.formTemplateId) {
        // Cari template yang sebelumnya terhubung dengan kategori ini (jika ada)
        const currentMapping = formCategoryMappings.find(m => m.categoryId === mapping.categoryId);
        if (currentMapping && currentMapping.formTemplateId) {
          // Jika ada template lama, set category_id-nya ke null/kosong
          // Ini mencegah satu template terhubung ke banyak kategori
          await formService.updateFormTemplate(currentMapping.formTemplateId, { category_id: '' });
        }

        // Update template baru untuk menunjuk ke kategori ini
        await formService.updateFormTemplate(mapping.formTemplateId, { category_id: mapping.categoryId });
      } else {
        // Jika formTemplateId kosong, artinya menghapus hubungan
        // Cari template yang saat ini terhubung ke kategori ini dan hapus category_id-nya
        const currentMapping = formCategoryMappings.find(m => m.categoryId === mapping.categoryId);
        if (currentMapping && currentMapping.formTemplateId) {
          await formService.updateFormTemplate(currentMapping.formTemplateId, { category_id: '' });
        }
      }
      // Kita tidak punya API endpoint terpisah untuk update mapping, jadi kita hanya mengandalkan update template.
      // Jika Anda memiliki endpoint terpisah, panggil di sini.
      return Promise.resolve({}); // Mengembalikan promise kosong karena tidak ada API call langsung untuk mapping
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formTemplatesAndMappings'] }); // Invalidasi cache
      toast({
        title: 'Kategori Berhasil Diperbarui',
        description: `Pengaturan kategori telah berhasil diperbarui.`,
      });
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category mapping';
      toast({
        title: 'Error',
        description: `Gagal memperbarui kategori: ${errorMessage}`,
        variant: 'destructive',
      });
    },
  });

  const updateCategoryMapping = async (mapping: FormCategoryMapping) => {
    await updateCategoryMappingMutation.mutateAsync(mapping);
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