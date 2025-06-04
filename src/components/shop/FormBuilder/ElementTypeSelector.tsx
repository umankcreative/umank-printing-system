import React from 'react';
import { FormElementType } from '../../../types/formTypes';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { AlignJustify, List, ChevronDown, ListChecks, CircleDot, Hash, Calendar, FileImage, Mail, Phone } from 'lucide-react';

interface ElementTypeSelectorProps {
  onSelectType: (type: FormElementType) => void;
  show: boolean;
  onClose: () => void;
}

const ElementTypeSelector: React.FC<ElementTypeSelectorProps> = ({ onSelectType, show, onClose }) => {
  const handleSelect = (type: FormElementType) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pilih Tipe Elemen</DialogTitle>
          <DialogDescription>
            Pilih tipe elemen form yang ingin Anda tambahkan ke template
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('input')}
          >
            <AlignJustify className="w-6 h-6" />
            <span>Input Text</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('textarea')}
          >
            <List className="w-6 h-6" />
            <span>Text Area</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('select')}
          >
            <ChevronDown className="w-6 h-6" />
            <span>Dropdown</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('checkbox')}
          >
            <ListChecks className="w-6 h-6" />
            <span>Checkbox</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('radio')}
          >
            <CircleDot className="w-6 h-6" />
            <span>Radio</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('number')}
          >
            <Hash className="w-6 h-6" />
            <span>Number</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('date')}
          >
            <Calendar className="w-6 h-6" />
            <span>Date Picker</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('file')}
          >
            <FileImage className="w-6 h-6" />
            <span>File Upload</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('email')}
          >
            <Mail className="w-6 h-6" />
            <span>Email</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleSelect('phone')}
          >
            <Phone className="w-6 h-6" />
            <span>No. Handphone</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ElementTypeSelector;
