
import React from 'react';

interface FloatingLabelInputProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  name, 
  className = '', 
  disabled = false,
  maxLength
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${className}`}
        placeholder=" "
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        spellCheck="false"
        aria-autocomplete="none"
      />
      <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-300 transform mb-4 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
