import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderContext } from '../context/OrderContext';
import { useForm as useAppForm } from '../context/FormContext';
import { FormTemplate, FormElement } from '../types/formTypes';
import { Order, OrderItem } from '../types/api';
import FormFieldRenderer from '../components/shop/forms/FormFieldRenderer';
import { toast } from '../hooks/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import FormProgress from '../components/shop/forms/FormProgress';
import FormNavigation from '../components/shop/forms/FormNavigation';
import { getValidationPattern, getValidationMessage } from '../lib/validationUtils';
import * as formService from '../services/formService';

const OrderItemForms: React.FC = () => {
  // --- SEMUA DEKLARASI HOOKS HARUS ADA DI SINI, DI ATAS ---
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrderContext();
  const { formCategoryMappings } = useAppForm();

  const [order, setOrder] = useState<Order | null>(null);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formsData, setFormsData] = useState<Record<string, Record<string, string | File | Date | null>>>({});
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | null>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm();
  const { handleSubmit, reset, formState: { errors } } = methods;

  // --- SEMUA USEEFFECT JUGA HARUS DI ATAS ---

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    const foundOrder = (orders as Order[]).find(o => o.id === orderId) || null;
    setOrder(foundOrder);
    // Only set loading to false if order is found or confirmed not found
    setLoading(false); // Dipindahkan ke sini agar selalu diset setelah cek order
  }, [orderId, orders]);

  useEffect(() => {
    if (!order) return;
    const fetchTemplates = async () => {
      let items: OrderItem[] = [];
      if (Array.isArray(order.items)) {
        items = order.items as OrderItem[];
      }
      const uniqueCategoryIds = Array.from(new Set(items.map(item => item.product?.category_id).filter(Boolean)));
      const uniqueTemplates: FormTemplate[] = [];
      for (const categoryId of uniqueCategoryIds) {
        const mapping = formCategoryMappings.find(m => m.categoryId === categoryId);
        if (mapping && mapping.categoryId) {
          try {
            const template = await formService.getFormTemplate(mapping.formTemplateId);
            if (template) {
              uniqueTemplates.push(template);
            }
          } catch (error) {
            console.error('Error fetching template:', error);
          }
        }
      }
      setTemplates(uniqueTemplates);
    };
    fetchTemplates();
  }, [order, formCategoryMappings]);

  useEffect(() => {
    reset();
    setCurrentStep(0);
    setFormsData({});
    setSelectedDates({});
    setSelectedFiles({});
  }, [order, reset]);

  // Ini adalah useEffect yang menyebabkan masalah jika ditempatkan setelah conditional returns.
  // Pindahkan ke atas, bersama useEffect lainnya.
  useEffect(() => {
    // Pastikan `templates` dan `currentTemplate` sudah ada sebelum mencoba mengaksesnya
    // karena useEffect ini bisa berjalan saat `templates` masih kosong di render awal.
    if (templates.length > 0) {
      const templateToLoad = templates[currentStep];
      if (templateToLoad && formsData[templateToLoad.id]) {
        reset(formsData[templateToLoad.id]);
        const currentTemplateData = formsData[templateToLoad.id];
        const newSelectedDates: Record<string, Date | null> = {};
        const newSelectedFiles: Record<string, File | null> = {};

        templateToLoad.elements?.forEach(element => {
          const value = currentTemplateData[element.id];
          if (element.type === 'date' && value instanceof Date) {
            newSelectedDates[element.id] = value;
          } else if (element.type === 'file' && value instanceof File) {
            newSelectedFiles[element.id] = value;
          }
        });
        setSelectedDates(newSelectedDates);
        setSelectedFiles(newSelectedFiles);
      } else {
        reset({});
        setSelectedDates({});
        setSelectedFiles({});
      }
    } else {
        // Jika templates masih kosong (misal, saat loading awal atau tidak ada template ditemukan),
        // pastikan form tetap direset dan state terkait dibersihkan.
        reset({});
        setSelectedDates({});
        setSelectedFiles({});
    }
  }, [currentStep, templates, formsData, reset]); // `templates` ditambahkan ke dependencies

  // currentTemplate didefinisikan di sini karena dependencies useEffect sudah mencakup `templates`
  // dan rendering JSX akan ada di bawah conditional renders.
  const currentTemplate = templates[currentStep];


  // --- CONDITIONAL RENDERS (DI SINI SEMUA HOOKS SUDAH DI DEKLARASIKAN) ---
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 pt- px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Memuat pesanan dan formulir...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8 pt- px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Tidak ada template form untuk kategori produk ini.</p>
        </div>
      </div>
    );
  }
  // --- END CONDITIONAL RENDERS ---


  const handleStepSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);

    const combinedDataForCurrentStep: Record<string, string | File | Date | null> = { ...data };

    Object.keys(selectedDates).forEach(key => {
      if (selectedDates[key]) {
        combinedDataForCurrentStep[key] = selectedDates[key];
      }
    });

    Object.keys(selectedFiles).forEach(key => {
      if (selectedFiles[key]) {
        combinedDataForCurrentStep[key] = selectedFiles[key];
      }
    });

    setFormsData(prev => ({
      ...prev,
      [currentTemplate.id]: combinedDataForCurrentStep
    }));

    try {
      const currentFormValues: Array<{ element_id: string; value: string; file: File | null }> = [];

      currentTemplate.elements?.forEach((element: FormElement) => {
        const value = combinedDataForCurrentStep[element.id];

        if (element.type === 'file' && value instanceof File) {
          currentFormValues.push({
            element_id: element.id,
            value: '',
            file: value,
          });
        } else if (value !== undefined && value !== null) {
          currentFormValues.push({
            element_id: element.id,
            value: String(value),
            file: null,
          });
        } else if (element.default_value) {
          currentFormValues.push({
            element_id: element.id,
            value: String(element.default_value),
            file: null,
          });
        }
      });

      const submission = {
        template_id: currentTemplate.id,
        customer_id: order.customer?.id || null,
        order_id: orderId,
        status: 'submitted',
        values: currentFormValues,
      };

      console.log('Submitting form for template:', currentTemplate.name, 'with data:', submission);

      await formService.createFormSubmission(submission);

      toast({
        title: 'Berhasil',
        description: `Form "${currentTemplate.name}" berhasil dikirim.`,
      });

      if (currentStep < templates.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedDates({});
        setSelectedFiles({});
      } else {
        toast({
          title: 'Semua Form Selesai',
          description: 'Semua formulir pesanan telah berhasil dikirim.',
        });
        reset();
        setCurrentStep(0);
        setFormsData({});
        setSelectedDates({});
        setSelectedFiles({});
      }

    } catch (error) {
      console.error('Error submitting form for template:', currentTemplate.name, error);
      toast({
        title: 'Gagal Mengirim Form',
        description: `Terjadi kesalahan saat mengirim form "${currentTemplate.name}".`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDateChange = (date: Date | null, elementId: string) => {
    setSelectedDates(prev => ({
      ...prev,
      [elementId]: date
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => ({
        ...prev,
        [elementId]: e.target.files?.[0] || null
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 pt- px-4">
      <h1 className="text-2xl font-bold mb-6">Isi Formulir untuk Kategori Item Pesanan</h1>
      <>
        <FormProgress currentStep={currentStep} totalSteps={templates.length} />
        <h2 className="text-xl font-semibold mb-4">{currentTemplate.name}</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-4 py-2">
            {currentTemplate.elements?.map(element => (
              <FormFieldRenderer
                key={element.id}
                element={element}
                selectedDates={selectedDates}
                selectedFiles={selectedFiles}
                onDateChange={handleDateChange}
                onFileChange={handleFileChange}
                errors={errors}
                getValidationPattern={getValidationPattern}
                getValidationMessage={getValidationMessage}
              />
            ))}
            <FormNavigation
              currentStep={currentStep}
              totalSteps={templates.length}
              onBack={handleBack}
              onCancel={() => {}}
              isSubmitting={isSubmitting}
            />
          </form>
        </FormProvider>
      </>
    </div>
  );
};

export default OrderItemForms;