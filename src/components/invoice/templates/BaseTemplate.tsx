
import React from 'react';

interface BaseTemplateProps {
  data: any;
  children: React.ReactNode;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({ data, children }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg mx-auto"
      style={{ width: "794px", height: "1123px" }}
    >
      {children}
    </div>
  );
};

export default BaseTemplate;
