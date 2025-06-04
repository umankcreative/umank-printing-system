
import React from 'react';
import { getTemplate } from '../../utils/templateRegistry';

interface InvoiceTemplateProps {
  data: any;
  templateNumber: number;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data, templateNumber }) => {
  const Template = getTemplate(templateNumber);
  return <Template data={data} />;
};

export default InvoiceTemplate;
