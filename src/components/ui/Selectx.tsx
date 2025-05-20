import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  name: string;
  id: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

const Selectx: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  name,
  id,
  placeholder = 'Select an option',
  className = '',
  error,
  required = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        required={required}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Selectx;
