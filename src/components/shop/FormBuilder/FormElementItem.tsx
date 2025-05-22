import React, { useState } from 'react';
import { FormElement, FormElementOption } from '../../../types/formTypes';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card1';
import { Button } from '../../ui/button';
import { Trash, Grip, Edit, Calendar, FileImage, Mail, Phone } from 'lucide-react';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { cn } from '../../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';

interface FormElementItemProps {
  element: FormElement;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

const FormElementItem: React.FC<FormElementItemProps> = ({ 
  element, 
  onEdit, 
  onDelete, 
  isDragging = false 
}) => {
  const renderPreview = () => {
    switch (element.type) {
      case 'input':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <Input 
              id={`preview-${element.id}`}
              placeholder={element.placeholder || ''}
              disabled
              className="mt-1"
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <Textarea 
              id={`preview-${element.id}`}
              placeholder={element.placeholder || ''}
              disabled
              className="mt-1"
            />
          </div>
        );
      case 'select':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <Select disabled>
              <SelectTrigger id={`preview-${element.id}`} className="mt-1">
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
          </div>
        );
      case 'checkbox':
        return (
          <div className="mt-2">
            <Label className="mb-2 block">{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            {element.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 mt-1">
                <Checkbox id={`preview-${element.id}-${option.value}`} disabled />
                <Label htmlFor={`preview-${element.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="mt-2">
            <Label className="mb-2 block">{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <RadioGroup disabled>
              {element.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 mt-1">
                  <RadioGroupItem value={option.value} id={`preview-${element.id}-${option.value}`} disabled />
                  <Label htmlFor={`preview-${element.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'number':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <Input 
              id={`preview-${element.id}`}
              placeholder={element.placeholder || ''}
              type="number"
              disabled
              className="mt-1"
            />
          </div>
        );
      case 'date':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <div className="mt-1 flex">
              <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground" disabled>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Pilih tanggal</span>
              </Button>
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <div className="mt-1 flex items-center justify-center w-full">
              <label htmlFor={`dropzone-file-${element.id}`} className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileImage className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {element.fileAccept || 'SVG, PNG, JPG atau GIF'}
                  </p>
                </div>
                <Input disabled id={`dropzone-file-${element.id}`} type="file" className="hidden" />
              </label>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id={`preview-${element.id}`}
                placeholder={element.placeholder || 'email@example.com'}
                type="email"
                disabled
                className="pl-10 mt-1"
              />
            </div>
          </div>
        );
      case 'phone':
        return (
          <div className="mt-2">
            <Label htmlFor={`preview-${element.id}`}>{element.label}{element.required && <span className="text-red-500">*</span>}</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id={`preview-${element.id}`}
                placeholder={element.placeholder || '08123456789'}
                type="tel"
                disabled
                className="pl-10 mt-1"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "border-2 transition-all", 
        isDragging ? "border-primary shadow-md" : "border-gray-200"
      )}
    >
      <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Grip className="w-4 h-4 cursor-move text-gray-500" />
          <CardTitle className="text-sm font-medium">
            {element.label}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderPreview()}
      </CardContent>
    </Card>
  );
};

export default FormElementItem;
