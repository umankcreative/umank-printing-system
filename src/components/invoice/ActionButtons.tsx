
import React from 'react';
import { Edit, FileText, Trash } from "lucide-react";

interface ActionButtonsProps {
  clearForm: () => void;
  fillDummyData: () => void;
  navigateToReceipt: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  clearForm,
  fillDummyData,
  navigateToReceipt,
}) => {
  return (
    <>
      <div className="fixed mt-10 top-4 left-4 flex gap-2">
        <button
          onClick={clearForm}
          className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
          aria-label="Clear Form"
        >
          <Trash size={24} />
        </button>
        <button
          onClick={fillDummyData}
          className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
          aria-label="Fill with Dummy Data"
        >
          <Edit size={24} />
        </button>
      </div>
      <button
        onClick={navigateToReceipt}
        className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600"
        aria-label="Switch to Receipt"
      >
        <FileText size={24} />
      </button>
    </>
  );
};

export default ActionButtons;
