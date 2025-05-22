import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  description?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
      {description && (
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default FormSection;
