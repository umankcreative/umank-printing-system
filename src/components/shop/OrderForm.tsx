
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormTemplate, FormSequenceData } from '../../types/formTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from '../../hooks/use-toast';
import FormFieldRenderer from './forms/FormFieldRenderer';
import FormProgress from './forms/FormProgress';
import FormNavigation from './forms/FormNavigation';
import { getValidationPattern, getValidationMessage } from '../../lib/validationUtils';

interface OrderFormProps {
  templates: FormTemplate[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, unknown>) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ templates, isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formsData, setFormsData] = useState<FormSequenceData>({});
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | null>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  
  const methods = useForm();
  const { handleSubmit, reset, formState: { errors } } = methods;
  
  // Reset form and state when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
      setCurrentStep(0);
      setFormsData({});
      setSelectedDates({});
      setSelectedFiles({});
    }
  }, [isOpen, reset]);
  
  // Reset form when changing steps
  useEffect(() => {
    reset();
  }, [currentStep, reset]);
  
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
    
    // Save current form data
    setFormsData(prev => ({
      ...prev,
      [currentTemplate.id]: data
    }));
    
    // If this is the last form, submit all data
    if (currentStep === templates.length - 1) {
      const allData = {
        ...formsData,
        [currentTemplate.id]: data
      };
      
      if (onSubmit) {
        onSubmit(allData);
      }
      
      toast({
        title: "Form berhasil dikirim",
        description: "Pesanan Anda sedang diproses"
      });
      
      reset();
      setCurrentStep(0);
      setFormsData({});
      setSelectedDates({});
      setSelectedFiles({});
      onClose();
    } else {
      // Move to the next form
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        {templates.length > 0 && (
          <>
            <DialogHeader>
              <DialogTitle>
                {currentTemplate?.name || 'Form Pemesanan'}
              </DialogTitle>
              
              <FormProgress 
                currentStep={currentStep} 
                totalSteps={templates.length} 
              />
              
              <DialogDescription>
                {currentTemplate?.description || 'Silakan lengkapi form pemesanan berikut'}
              </DialogDescription>
            </DialogHeader>
            
            {currentTemplate && (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6 py-4">
                  {currentTemplate.elements.map(element => (
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
                    onCancel={onClose}
                  />
                </form>
              </FormProvider>
            )}
          </>
        )}
        
        {templates.length === 0 && (
          <div className="py-6 text-center">
            <p className="text-gray-500">Tidak ada template form untuk kategori produk ini.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
