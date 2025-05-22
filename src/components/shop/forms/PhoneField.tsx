import React from 'react';
import { FormElement } from '../../../types/formTypes';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Phone } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface PhoneFieldProps {
  element: FormElement;
  validationPattern: RegExp;
  validationMessage: string;
}

const PhoneField: React.FC<PhoneFieldProps> = ({ element, validationPattern, validationMessage }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor={element.id}>
        {element.label}
        {element.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id={element.id}
          type="tel"
          placeholder={element.placeholder || '08123456789'}
          className="pl-10"
          {...register(element.id, { 
            required: element.required,
            pattern: {
              value: validationPattern,
              message: validationMessage
            }
          })}
        />
      </div>
      {errors[element.id] && (
        <p className="text-sm text-red-500">
          {errors[element.id]?.message?.toString() || "Format nomor telepon tidak valid"}
        </p>
      )}
    </div>
  );
};

export default PhoneField;
