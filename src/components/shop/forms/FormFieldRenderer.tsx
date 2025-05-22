
import React from 'react';
import { FormElement } from '../../../types/formTypes';
import TextInputField from './TextInputField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import RadioField from './RadioField';
import NumberField from './NumberField';
import DateField from './DateField';
import FileField from './FileField';
import EmailField from './EmailField';
import PhoneField from './PhoneField';

interface FormFieldRendererProps {
  element: FormElement;
  selectedDates: Record<string, Date | null>;
  selectedFiles: Record<string, File | null>;
  onDateChange: (date: Date | null, elementId: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => void;
  errors: Record<string, any>;
  getValidationPattern: (element: FormElement) => RegExp;
  getValidationMessage: (element: FormElement) => string;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  element,
  selectedDates,
  selectedFiles,
  onDateChange,
  onFileChange,
  errors,
  getValidationPattern,
  getValidationMessage,
}) => {
  switch (element.type) {
    case 'input':
      return <TextInputField element={element} />;
      
    case 'textarea':
      return <TextareaField element={element} />;
      
    case 'select':
      return <SelectField element={element} />;
      
    case 'checkbox':
      return <CheckboxField element={element} />;
      
    case 'radio':
      return <RadioField element={element} />;
      
    case 'number':
      return <NumberField element={element} />;
      
    case 'date':
      return (
        <DateField
          element={element}
          selectedDate={selectedDates[element.id]}
          onDateChange={onDateChange}
          error={!!errors[element.id]}
        />
      );
      
    case 'file':
      return (
        <FileField
          element={element}
          selectedFile={selectedFiles[element.id]}
          onFileChange={onFileChange}
          error={!!errors[element.id]}
        />
      );
      
    case 'email':
      return (
        <EmailField
          element={element}
          validationPattern={getValidationPattern(element)}
          validationMessage={getValidationMessage(element)}
        />
      );
      
    case 'phone':
      return (
        <PhoneField
          element={element}
          validationPattern={getValidationPattern(element)}
          validationMessage={getValidationMessage(element)}
        />
      );
      
    default:
      return null;
  }
};

export default FormFieldRenderer;
