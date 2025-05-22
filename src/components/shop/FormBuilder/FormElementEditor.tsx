
import React, { useState, useEffect } from 'react';
import { FormElement, FormElementOption } from '../../../types/formTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Plus, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FormElementEditorProps {
  isOpen: boolean;
  onClose: () => void;
  element: FormElement | null;
  onSave: (element: FormElement) => void;
}

const FormElementEditor: React.FC<FormElementEditorProps> = ({
  isOpen,
  onClose,
  element,
  onSave,
}) => {
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<FormElementOption[]>([]);
  const [fileAccept, setFileAccept] = useState('');

  useEffect(() => {
    if (element) {
      setLabel(element.label);
      setPlaceholder(element.placeholder || '');
      setRequired(element.required);
      setOptions(element.options || []);
      setFileAccept(element.fileAccept || '');
    } else {
      resetForm();
    }
  }, [element, isOpen]);

  const resetForm = () => {
    setLabel('');
    setPlaceholder('');
    setRequired(false);
    setOptions([]);
    setFileAccept('');
  };

  const handleAddOption = () => {
    setOptions([...options, { label: '', value: uuidv4().slice(0, 8) }]);
  };

  const handleOptionLabelChange = (index: number, label: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label };
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!element) return;
    
    let validation;
    
    // Tambahkan validasi khusus untuk tipe elemen
    if (element.type === 'phone') {
      validation = {
        pattern: '/^(?:\\+62|62|0)[2-9]\\d{7,11}$/',
        message: 'Masukkan format nomor handphone Indonesia yang valid'
      };
    } else if (element.type === 'email') {
      validation = {
        pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/',
        message: 'Masukkan format email yang valid'
      };
    }
    
    const updatedElement: FormElement = {
      ...element,
      label,
      placeholder: placeholder || undefined,
      required,
      options: ['select', 'checkbox', 'radio'].includes(element.type) ? options : undefined,
      fileAccept: element.type === 'file' ? fileAccept : undefined,
      validation: validation,
    };

    onSave(updatedElement);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Elemen Form</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Masukkan label"
            />
          </div>

          {element && element.type !== 'file' && (
            <div className="grid gap-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                placeholder="Masukkan placeholder"
              />
            </div>
          )}

          {element && element.type === 'file' && (
            <div className="grid gap-2">
              <Label htmlFor="fileAccept">Jenis File</Label>
              <Input
                id="fileAccept"
                value={fileAccept}
                onChange={(e) => setFileAccept(e.target.value)}
                placeholder="image/*, .pdf, .doc (pisahkan dengan koma)"
              />
              <p className="text-xs text-muted-foreground">
                Contoh: image/* untuk semua gambar, .pdf untuk file PDF
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={required}
              onCheckedChange={(checked) => setRequired(checked === true)}
            />
            <Label htmlFor="required">Wajib diisi</Label>
          </div>

          {element && ['select', 'checkbox', 'radio'].includes(element.type) && (
            <div className="grid gap-2">
              <Label>Opsi</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) =>
                      handleOptionLabelChange(index, e.target.value)
                    }
                    placeholder={`Opsi ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={handleAddOption}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Opsi
              </Button>
            </div>
          )}
          
          {element && element.type === 'phone' && (
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Format Nomor Telepon Indonesia
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Dapat diawali dengan +62, 62, atau 0</li>
                      <li>Diikuti dengan angka 2-9</li>
                      <li>Panjang nomor setelahnya 7-11 digit</li>
                      <li>Contoh: +628123456789, 081234567890</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {element && element.type === 'email' && (
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Format Email
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Format email standar: nama@domain.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" onClick={handleSave} disabled={!label}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormElementEditor;
