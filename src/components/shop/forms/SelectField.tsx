
import React from 'react';
import { FormElement } from '../../../types/formTypes';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useFormContext } from 'react-hook-form';

interface SelectFieldProps {
  element: FormElement;
}

const SelectField: React.FC<SelectFieldProps> = ({ element }) => {
  const { setValue, watch, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor={element.id}>
        {element.label}
        {element.required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        onValueChange={(value) => setValue(element.id, value)}
        defaultValue={watch(element.id)}
      >
        <SelectTrigger id={element.id}>
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
      {errors[element.id] && (
        <p className="text-sm text-red-500">Field ini wajib diisi</p>
      )}
    </div>
  );
};

export default SelectField;
