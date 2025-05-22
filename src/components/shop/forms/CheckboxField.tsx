
import React from 'react';
import { FormElement } from '../../../types/formTypes';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { useFormContext } from 'react-hook-form';

interface CheckboxFieldProps {
  element: FormElement;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ element }) => {
  const { setValue, watch, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {element.label}
        {element.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid gap-2">
        {element.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${element.id}-${option.value}`}
              value={option.value}
              onCheckedChange={(checked) => {
                if (checked) {
                  const currentValues = watch(element.id) || [];
                  setValue(element.id, [...currentValues, option.value]);
                } else {
                  const currentValues = watch(element.id) || [];
                  setValue(
                    element.id,
                    currentValues.filter((v: string) => v !== option.value)
                  );
                }
              }}
            />
            <Label htmlFor={`${element.id}-${option.value}`}>
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {errors[element.id] && (
        <p className="text-sm text-red-500">Pilih setidaknya satu opsi</p>
      )}
    </div>
  );
};

export default CheckboxField;
