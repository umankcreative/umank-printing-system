import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 5,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0 &&
      images.length < maxImages
    ) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      images.length < maxImages
    ) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // In a real app, you would upload these files to a server
    // Here we're just creating object URLs for demonstration
    const newImages = [...images];

    Array.from(files).forEach((file) => {
      if (newImages.length < maxImages && file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }
    });

    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-700 mb-1">Drag & drop images here</p>
          <p className="text-xs text-gray-500 mb-3">or</p>
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
            Browse Files
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleChange}
              disabled={images.length >= maxImages}
            />
          </label>
          {images.length >= maxImages && (
            <p className="text-xs text-red-500 mt-2">
              Maximum number of images reached
            </p>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
