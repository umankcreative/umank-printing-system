import React, { useState, useRef } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { Upload, X } from 'lucide-react';

interface ResponseFormProps {
  taskId: string;
  eventId: string;
  onSubmitted: () => void;
}

const ResponseForm: React.FC<ResponseFormProps> = ({ taskId, eventId, onSubmitted }) => {
  const { addResponse } = useTaskContext();
  
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check if the file is an image (jpg, png, jpeg)
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (jpg, png, jpeg)');
        return;
      }
      
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // For demonstration, we're simulating file upload by using the preview URL
    // In a real application, you would upload the file to a server or storage service
    setTimeout(() => {
      addResponse(taskId, eventId, {
        author,
        content,
        fileUrl: previewUrl || undefined,
        fileType: selectedFile?.type
      });
      
      setIsSubmitting(false);
      setAuthor('');
      setContent('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSubmitted();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your name"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Your Response
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your thoughts or updates..."
          rows={3}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attach Image (optional)
        </label>
        
        {!selectedFile ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Click to upload an image (JPG, PNG)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative">
            <div className="rounded-md overflow-hidden border border-gray-200">
              <img 
                src={previewUrl || ''} 
                alt="Preview" 
                className="max-h-48 max-w-full mx-auto object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-100 text-red-700 rounded-full p-1 hover:bg-red-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !author.trim() || !content.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </button>
      </div>
    </form>
  );
};

export default ResponseForm;