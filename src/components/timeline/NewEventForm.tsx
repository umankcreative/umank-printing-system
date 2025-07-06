import React, { useState, useRef } from 'react';
// import { useTaskContext } from '../../context/TaskContext';
// import { v4 as uuidv4 } from 'uuid';
import  timelineService  from '../../services/timelineService';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface NewEventFormProps {
  taskId: string;
  onEventAdded?: () => void;
}

const NewEventForm: React.FC<NewEventFormProps> = ({
  taskId,
  onEventAdded,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<
    'pending' | 'in-progress' | 'completed' | 'blocked'
    >('pending');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const { addTaskEvent } = useTaskContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (jpg, png, jpeg)');
        return;
      }
      
      setSelectedFile(file);
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    const mappedStatus = status === 'pending' ? 'todo' : status;
    const payload = {
      task_id: taskId,
      title: title.trim(),
      description: description.trim(),
      status: mappedStatus as 'todo' | 'pending' | 'in-progress' | 'completed' | 'blocked',
      timestamp: new Date().toISOString(),
      file_url: null,
      file_type: null,
    };

    try {
      await timelineService.createTimelineEvent(payload);
      setTitle('');
      setDescription('');
      setStatus('pending');
      onEventAdded?.();
    } catch (error) {
      console.error('Failed to add timeline event', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white rounded-lg shadow p-6"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Judul Event
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Tambah Event
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lampirkan Gambar (opsional)
        </label>
        
        {!selectedFile ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Klik untuk upload Gambar (JPG, PNG)
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
    </form>
  );
};

export default NewEventForm;
