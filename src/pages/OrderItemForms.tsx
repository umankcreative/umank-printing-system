import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderContext } from '../context/OrderContext';
import { useForm as useAppForm } from '../context/FormContext';
import { FormTemplate } from '../types/formTypes';
import { Order, OrderItem } from '../types/api';
import FormFieldRenderer from '../components/shop/forms/FormFieldRenderer';
// import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import FormProgress from '../components/shop/forms/FormProgress';
import FormNavigation from '../components/shop/forms/FormNavigation';
import { getValidationPattern, getValidationMessage } from '../lib/validationUtils';
// Import formService to fetch form templates
import * as formService from '../services/formService';

const OrderItemForms: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrderContext();
  const { formCategoryMappings, getFormTemplateForCategory } = useAppForm();

  const [order, setOrder] = useState<Order | null>(null);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formsData, setFormsData] = useState<Record<string, any>>({});
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | null>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  const methods = useForm();
  const { handleSubmit, reset, formState: { errors } } = methods;

  useEffect(() => {
    if (!orderId) return;
    const foundOrder = (orders as Order[]).find(o => o.id === orderId) || null;
    setOrder(foundOrder);
    setLoading(false);
  }, [orderId, orders]);

  useEffect(() => {
    if (!order) return;
    const fetchTemplates = async () => {
      let items: OrderItem[] = [];
      if (Array.isArray(order.items)) {
        items = order.items as OrderItem[];
      }
      // Get unique category IDs from order items
      const uniqueCategoryIds = Array.from(new Set(items.map(item => item.product?.category_id).filter(Boolean)));
      const uniqueTemplates: FormTemplate[] = [];
      for (const categoryId of uniqueCategoryIds) {
        const mapping = formCategoryMappings.find(m => m.categoryId === categoryId);
        if (mapping && mapping.categoryId) {
          try {
            const template = await formService.getFormTemplate(mapping.formTemplateId);
            console.log('Found template for category:', {
              categoryId: mapping.categoryId,
              categoryName: mapping.categoryName,
              formTemplateId: mapping.formTemplateId,
            }); 
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
  }, [order, formCategoryMappings, getFormTemplateForCategory]);

  // Reset form and state when order changes
  useEffect(() => {
    reset();
    setCurrentStep(0);
    setFormsData({});
    setSelectedDates({});
    setSelectedFiles({});
  }, [order, reset]);

  // if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  const currentTemplate = templates[currentStep];

  const handleStepSubmit = (data: Record<string, unknown>) => {
    // Add date data for current form
    Object.keys(selectedDates).forEach(key => {
      if (selectedDates[key]) {
        data[key] = selectedDates[key];
      }
    });
    // Add file information for current form
    Object.keys(selectedFiles).forEach(key => {
      if (selectedFiles[key]) {
        data[key] = selectedFiles[key].name;
      }
    });
    setFormsData(prev => ({
      ...prev,
      [currentTemplate.id]: data
    }));

    if (currentStep === templates.length - 1) {
      const allData = {
        ...formsData,
        [currentTemplate.id]: data
      };
      toast({
        title: 'Form berhasil dikirim',
        description: 'Pesanan Anda sedang diproses'
      });
      reset();
      setCurrentStep(0);
      setFormsData({});
      setSelectedDates({});
      setSelectedFiles({});
      // Optionally: send allData to backend here
    } else {
      setCurrentStep(prev => prev + 1);
      setSelectedDates({});
      setSelectedFiles({});
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSelectedDates({});
      setSelectedFiles({});
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
    <div className="max-w-2xl mx-auto py-8 pt-32 px-4">
      <h1 className="text-2xl font-bold mb-6">Isi Formulir untuk Kategori Item Pesanan</h1>
      {templates.length > 0 && (
        <>
          <FormProgress currentStep={currentStep} totalSteps={templates.length} />
          <h2 className="text-xl font-semibold mb-4">{templates[currentStep].name}</h2>
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
              />
            </form>
          </FormProvider>
        </>
      )}
      {templates.length === 0 && (
        <div className="py-6 text-center">
          <p className="text-gray-500">Tidak ada template form untuk kategori produk ini.</p>
        </div>
      )}
    </div>
  );
};

export default OrderItemForms;
