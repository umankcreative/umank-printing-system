import React from 'react';
import { FormElement } from '../../../types/formTypes';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { useFormContext } from 'react-hook-form';

interface RadioFieldProps {
  element: FormElement;
}

const RadioField: React.FC<RadioFieldProps> = ({ element }) => {
  const { setValue, watch, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {element.label}
        {element.required && <span className="text-red-500">*</span>}
      </Label>
      <RadioGroup
        onValueChange={(value) => setValue(element.id, value)}
        defaultValue={watch(element.id)}
      >
        {element.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${element.id}-${option.value}`} />
            <Label htmlFor={`${element.id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {errors[element.id] && (
        <p className="text-sm text-red-500">Pilih salah satu opsi</p>
      )}
    </div>
  );
};

export default RadioField;
