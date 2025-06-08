import React from 'react';
import { formatDistance } from 'date-fns';

interface PublicTimelineItemProps {
  event: {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
    file_url?: string;
    file_type?: string;
  };
  isLast: boolean;
}

const PublicTimelineItem: React.FC<PublicTimelineItemProps> = ({ event, isLast }) => {
  const getStatusIcon = (status: string) => {
    const baseClasses = "h-12 w-12 rounded-full flex items-center justify-center border-4";
    
    switch (status) {
      case 'unpaid':
        return <div className={`${baseClasses} bg-red-100 border-red-200 text-red-600`}></div>;
      case 'paid':
        return <div className={`${baseClasses} bg-green-100 border-green-200 text-green-600`}></div>;
      case 'design':
        return <div className={`${baseClasses} bg-yellow-100 border-yellow-200 text-yellow-600`}></div>;
      case 'printing':
        return <div className={`${baseClasses} bg-blue-100 border-blue-200 text-blue-600`}></div>;
      case 'finishing':
        return <div className={`${baseClasses} bg-purple-100 border-purple-200 text-purple-600`}></div>;
      case 'completed':
        return <div className={`${baseClasses} bg-green-100 border-green-200 text-green-600`}></div>;
      case 'blocked':
        return <div className={`${baseClasses} bg-red-100 border-red-200 text-red-600`}></div>;
      default:
        return <div className={`${baseClasses} bg-gray-100 border-gray-200 text-gray-600`}></div>;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'design':
        return 'bg-yellow-100 text-yellow-800';
      case 'printing':
        return 'bg-blue-100 text-blue-800';
      case 'finishing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'Menunggu Pembayaran';
      case 'paid':
        return 'Pembayaran Diterima';
      case 'design':
        return 'Sedang Didesain';
      case 'printing':
        return 'Proses Cetak';
      case 'finishing':
        return 'Finishing';
      case 'completed':
        return 'Selesai';
      case 'blocked':
        return 'Terhambat';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
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
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(event.status)}`}>
              {getStatusText(event.status)}
            </span>
          </div>

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

          <div className="text-gray-500 text-sm">
            {formatDate(event.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTimelineItem;