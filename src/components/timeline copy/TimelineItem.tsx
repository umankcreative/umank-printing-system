import React, { useState } from 'react';
import { TaskStatus } from '../../types';
import { formatDistance } from 'date-fns';
import { MessageSquare, File, ChevronDown, ChevronUp, Image, Check, X, AlertCircle } from 'lucide-react';
import ResponseThumbnails from './ResponseThumbnails';
import ResponseForm from './ResponseForm';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface TimelineItemProps {
  event: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    created_at: string;
    file_url?: string;
    file_type?: string;
  };
  taskId: string;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, taskId, isLast }) => {
  const [showResponses, setShowResponses] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(event.status);
  const [error, setError] = useState<string | null>(null);

  const getStatusIcon = (status: TaskStatus) => {
    const baseClasses = "h-12 w-12 rounded-full flex items-center justify-center border-4";
    
    switch (status) {
      case 'pending':
        return <div className={`${baseClasses} bg-yellow-100 border-yellow-200 text-yellow-600`}></div>;
      case 'unpaid':
        return <div className={`${baseClasses} bg-red-200 border-yellow-200 text-yellow-600`}></div>;
      case 'paid':
        return <div className={`${baseClasses} bg-green-200 border-yellow-200 text-yellow-600`}></div>;
      case 'design':
        return <div className={`${baseClasses} bg-yellow-200 border-yellow-200 text-yellow-600`}></div>;
      case 'printing':
        return <div className={`${baseClasses} bg-blue-200 border-blue-200 text-blue-600`}></div>;
      case 'completed':
        return <div className={`${baseClasses} bg-green-100 border-green-200 text-green-600`}></div>;
      case 'blocked':
        return <div className={`${baseClasses} bg-red-100 border-red-200 text-red-600`}></div>;
      default:
        return <div className={`${baseClasses} bg-gray-100 border-gray-200 text-gray-600`}></div>;
    }
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-200 text-yellow-800';
      case 'paid':
        return 'bg-green-200 text-yellow-800';
      case 'design':
        return 'bg-yellow-200 text-yellow-800';
      case 'printing':
        return 'bg-blue-200 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  const handleStatusUpdate = async () => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .update({ status: selectedStatus })
        .eq('id', event.id);

      if (error) throw error;

      await supabase
        .from('tasks1')
        .update({ status: selectedStatus })
        .eq('id', taskId);

      setIsEditingStatus(false);
      setError(null);
      toast.success('Status updated successfully');
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update status. Please try again.');
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="relative flex gap-6">
      {/* Timeline dot */}
      <div className="flex-shrink-0 z-10">
        {getStatusIcon(event.status)}
      </div>

      {/* Content */}
      <div className="flex-grow pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
            
            {isEditingStatus ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unpaid">Waiting for Payment</option>
                  <option value="paid">Payment Received</option>
                  <option value="design">In Design</option>
                  <option value="printing">Printing</option>
                  <option value="finishing">Finishing</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="p-1 text-green-600 hover:text-green-700 transition"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingStatus(false);
                    setSelectedStatus(event.status);
                  }}
                  className="p-1 text-red-600 hover:text-red-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingStatus(true)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(event.status)} hover:opacity-80 transition`}
              >
                {event.status.replace('-', ' ')}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-gray-600 mb-4">{event.description}</p>
          
          {/* Display event image if available */}
          {event.file_url && (
            <div className="mb-4">
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={event.file_url} 
                  alt={event.title}
                  className="w-full max-h-96 object-contain"
                />
              </div>
            </div>
          )}

          <div className="text-gray-500 text-sm mb-4">
            {formatDate(event.created_at)}
          </div>

          <div className="flex flex-wrap justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <button
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              onClick={() => setShowResponseForm(!showResponseForm)}
            >
              <File className="h-4 w-4 mr-1" />
              <span>{showResponseForm ? 'Cancel' : 'Add Response'}</span>
            </button>
          </div>

          {/* Response form */}
          {showResponseForm && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
              <ResponseForm 
                taskId={taskId} 
                eventId={event.id} 
                onSubmitted={() => setShowResponseForm(false)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;