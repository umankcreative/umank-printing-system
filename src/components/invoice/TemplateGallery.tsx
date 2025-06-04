
import React from 'react';
import { templates } from "../../utils/templateRegistry";

interface TemplateGalleryProps {
  handleTemplateClick: (templateNumber: number) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ handleTemplateClick }) => {
  return (
    <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Template Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template: any, index: number) => (
          <div
            key={index}
            className="template-card bg-gray-100 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleTemplateClick(index + 1)}
          >
            <img
              src={`/assets/template${index + 1}-preview.png`}
              alt={template.name}
              className={`w-full ${
                template.name === "Template 10"
                  ? "h-[38px] w-[57px]"
                  : "h-50"
              } object-cover rounded mb-2`}
            />
            <p className="text-center font-medium">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
