import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormTemplate, FormElement } from '../types/formTypes';
import * as formService from '../services/formService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card1';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';

interface FormData {
  [key: string]: string | File | null;
}

const PublicForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!id) return;
      
      try {
        const loadedTemplate = await formService.getFormTemplate(id);
        setTemplate(loadedTemplate);
        
        // Initialize form data with default values
        const initialData: FormData = {};
        loadedTemplate.elements?.forEach((element: FormElement) => {
          initialData[element.id] = element.default_value || '';
        });
        setFormData(initialData);
      } catch (error) {
        console.error('Error loading template:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat form template',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [id]);

  const handleInputChange = (elementId: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [elementId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    setIsSubmitting(true);
    try {
      // Transform formData into the expected format
      const values = Object.entries(formData).map(([elementId, value]) => {
        return {
          element_id: elementId,
          value: value instanceof File ? '' : String(value),
          file: value instanceof File ? value : null
        }
      });

      // Create form submission with the correct structure
      const submission = {
        template_id: template.id,
        customer_id: null, // Optional, can be set later
        order_id: null, // Optional, can be set later
        status: 'submitted',
        values: values as Record<string, string | File>[],
        // Note: We assume that the API expects 'values' to be an array of objects
        // where each object has 'element_id', 'value', and optionally 'file'.
        // If the API expects a different structure, adjust accordingly.
        // We are not including customer_id and order_id here since they are optional
        // and can be set later if needed.
        // If you need to include customer_id and order_id, you can set them here.
        // For example:
        // customer_id: '12345', // This would be the ID of the customer if available
        // order_id: '67890', // This would be the ID of the order if available
        // If you have customer_id and order_id, you can include them here.
        // For now, we are leaving them as null since they are optional.
        // customer_id and order_id are optional, so we don't include them
      };

      console.log('Submitting form:', submission);
      await formService.createFormSubmission(submission);
      
      toast({
        title: 'Berhasil',
        description: 'Form berhasil dikirim',
      });

      // Reset form
      const initialData: FormData = {};
      template.elements?.forEach((element: FormElement) => {
        initialData[element.id] = element.default_value || '';
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengirim form',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormElement = (element: FormElement) => {
    switch (element.type) {
      case 'input':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div key={element.id} className="space-y-2">
            <Label htmlFor={element.id} className='hidden md:block'>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={element.id}
              type={element.type === 'phone' ? 'tel' : element.type}
              placeholder={element.placeholder || ''}
              value={formData[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.required}
              pattern={element.validation_pattern || undefined}
            />
            {element.validation_message && (
              <p className="text-sm text-gray-500">{element.validation_message}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={element.id} className="space-y-2">
            <Label htmlFor={element.id}  className='hidden md:block'>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={element.id}
              placeholder={element.placeholder || ''}
              value={formData[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.required}
            />
            {element.validation_message && (
              <p className="text-sm text-gray-500">{element.validation_message}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={element.id} className="space-y-2">
            <Label htmlFor={element.id}>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[element.id] || ''}
              onValueChange={(value) => handleInputChange(element.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={element.placeholder || 'Pilih opsi'} />
              </SelectTrigger>
              <SelectContent>
                {element.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {element.validation_message && (
              <p className="text-sm text-gray-500">{element.validation_message}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={element.id} className="space-y-2">
            <Label htmlFor={element.id}  className='hidden md:block'>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={element.id}
              type="file"
              accept={element.file_accept || undefined}
              onChange={(e) => handleInputChange(element.id, e.target.files?.[0] || null)}
              required={element.required}
            />
            {element.validation_message && (
              <p className="text-sm text-gray-500">{element.validation_message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Form tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>{template.name}</CardTitle>
          <CardDescription>{template.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {template.elements?.map(renderFormElement)}
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicForm;