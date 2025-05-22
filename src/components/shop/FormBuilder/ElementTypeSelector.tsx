
import React from 'react';
import { FormElementType } from '../../../types/formTypes';
import { Button } from '../../ui/button';
import { AlignJustify, List, ChevronDown, ListChecks, CircleDot, Hash, Calendar, FileImage, Mail, Phone } from 'lucide-react';

interface ElementTypeSelectorProps {
  onSelectType: (type: FormElementType) => void;
}

const ElementTypeSelector: React.FC<ElementTypeSelectorProps> = ({ onSelectType }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('input')}
      >
        <AlignJustify className="w-6 h-6" />
        <span>Input Text</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('textarea')}
      >
        <List className="w-6 h-6" />
        <span>Text Area</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('select')}
      >
        <ChevronDown className="w-6 h-6" />
        <span>Dropdown</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('checkbox')}
      >
        <ListChecks className="w-6 h-6" />
        <span>Checkbox</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('radio')}
      >
        <CircleDot className="w-6 h-6" />
        <span>Radio</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('number')}
      >
        <Hash className="w-6 h-6" />
        <span>Number</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('date')}
      >
        <Calendar className="w-6 h-6" />
        <span>Date Picker</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('file')}
      >
        <FileImage className="w-6 h-6" />
        <span>File Upload</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('email')}
      >
        <Mail className="w-6 h-6" />
        <span>Email</span>
      </Button>
      
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => onSelectType('phone')}
      >
        <Phone className="w-6 h-6" />
        <span>No. Handphone</span>
      </Button>
    </div>
  );
};

export default ElementTypeSelector;
