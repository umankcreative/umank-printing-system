import React from 'react';
import { Response } from '../../types';

interface ResponseThumbnailsProps {
  responses: Response[];
}

const ResponseThumbnails: React.FC<ResponseThumbnailsProps> = ({ responses }) => {
  // Filter responses that have file URLs
  const responsesWithFiles = responses.filter(response => response.fileUrl);
  
  // If no responses have files, return null
  if (responsesWithFiles.length === 0) {
    return null;
  }

  // Display up to 4 thumbnails, with a "+X more" indicator if there are more
  const maxDisplay = 4;
  const displayResponses = responsesWithFiles.slice(0, maxDisplay);
  const remainingCount = responsesWithFiles.length - maxDisplay;

  return (
    <div className="flex items-center space-x-2 overflow-hidden">
      {displayResponses.map((response) => (
        <div 
          key={response.id} 
          className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <img 
            src={response.fileUrl} 
            alt={`Response from ${response.author}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 border border-gray-200">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default ResponseThumbnails;