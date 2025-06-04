import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { productService } from '../../services/productService';
import { ProductImage } from '../../types/api';

interface ProductImagesUploadProps {
  productId: string;
  onImagesUploaded?: () => void;
  existingImages?: ProductImage[];
}

const ProductImagesUpload: React.FC<ProductImagesUploadProps> = ({
  productId,
  onImagesUploaded,
  existingImages = []
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log('Selected files:', files);
      
      // Validate file types and size
      const validFiles = files.filter(file => {
        console.log('Validating file:', file.name, 'Type:', file.type, 'Size:', file.size);
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} is not a valid image type. Allowed types: JPG, PNG, GIF, WEBP`);
          return false;
        }
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 2MB)`);
          return false;
        }
        return true;
      });

      console.log('Valid files after filtering:', validFiles);

      if (validFiles.length !== files.length) {
        toast.error('Some files were rejected. Please check the requirements.');
      }
      setSelectedFiles(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    // Use the same validation as handleFileSelect
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type. Allowed types: JPG, PNG, GIF, WEBP`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 2MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files were rejected. Please check the requirements.');
    }
    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select images to upload');
      return;
    }

    console.log('Starting upload with files:', selectedFiles);
    setIsUploading(true);
    try {
      const result = await productService.uploadProductImages(productId, selectedFiles);
      console.log('Upload successful, updated product:', result);
      toast.success('Images uploaded successfully');
      setSelectedFiles([]);
      onImagesUploaded?.();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    setIsDeleting(imageId);
    try {
      await productService.deleteProductImage(productId, imageId);
      toast.success('Image deleted successfully');
      onImagesUploaded?.();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(null);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Existing Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={`${'http://127.0.0.1:8000'}${image.url}`}
                    alt="Product image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={isDeleting === image.id}
                  className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                    ${isDeleting === image.id ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'} 
                    transition-opacity duration-200`}
                  aria-label="Delete image"
                >
                  <X className="w-4 h-4" />
                </button>
                {isDeleting === image.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-700 mb-1">Drag & drop product images here</p>
          <p className="text-xs text-gray-500 mb-1">Allowed types: JPG, PNG, GIF, WEBP</p>
          <p className="text-xs text-gray-500 mb-3">Max size: 2MB per image</p>
          <label className={`cursor-pointer bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors duration-200 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            Browse Files
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`btn btn-primary ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImagesUpload; 