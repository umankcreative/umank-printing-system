
import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { Contact, InvoiceInfo } from '../../utils/dummyData';

interface InvoiceInformationProps {
  invoice: InvoiceInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InvoiceInformation: React.FC<InvoiceInformationProps> = ({
  invoice,
  handleInputChange,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">
        Invoice Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FloatingLabelInput
          id="invoiceNumber"
          label="Invoice Number"
          value={invoice.number}
          onChange={handleInputChange}
          name="number"
        />
        <FloatingLabelInput
          id="invoiceDate"
          label="Invoice Date"
          type="date"
          value={invoice.date}
          onChange={handleInputChange}
          name="date"
        />
        <FloatingLabelInput
          id="paymentDate"
          label="Payment Date"
          type="date"
          value={invoice.paymentDate}
          onChange={handleInputChange}
          name="paymentDate"
        />
      </div>
    </div>
  );
};

export default InvoiceInformation;
