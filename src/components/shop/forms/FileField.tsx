
import React from 'react';
import { FormElement } from '../../../types/formTypes';
import { Label } from '../../ui/label';
import { Check } from 'lucide-react';

interface FileFieldProps {
  element: FormElement;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => void;
  error?: boolean;
}

const FileField: React.FC<FileFieldProps> = ({ element, selectedFile, onFileChange, error }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={element.id}>
        {element.label}
        {element.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={element.id}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          {selectedFile ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Check className="w-8 h-8 mb-2 text-green-500" />
              <p className="mb-2 text-sm text-gray-500">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                Klik untuk mengganti file
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Klik untuk upload</span> atau drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {element.fileAccept || 'PNG, JPG, GIF'}
              </p>
            </div>
          )}
          <input
            id={element.id}
            type="file"
            className="hidden"
            accept={element.fileAccept || 'image/*'}
            onChange={(e) => onFileChange(e, element.id)}
          />
        </label>
      </div>
      {element.required && !selectedFile && error && (
        <p className="text-sm text-red-500">Upload file</p>
      )}
    </div>
  );
};

export default FileField;
