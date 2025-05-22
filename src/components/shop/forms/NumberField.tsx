import React from 'react';
import { FormElement } from '../../../types/formTypes';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useFormContext } from 'react-hook-form';

interface NumberFieldProps {
  element: FormElement;
}

const NumberField: React.FC<NumberFieldProps> = ({ element }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor={element.id}>
        {element.label}
        {element.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={element.id}
        type="number"
        placeholder={element.placeholder || ''}
        {...register(element.id, { required: element.required })}
      />
      {errors[element.id] && (
        <p className="text-sm text-red-500">Field ini wajib diisi</p>
      )}
    </div>
  );
};

export default NumberField;
