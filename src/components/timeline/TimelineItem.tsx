import React from 'react';
import { TimelineEvent } from '../../types';
import { format, isValid } from 'date-fns';
import { MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast }) => {
  const getStatusIcon = () => {
    switch (event.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (event.status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'blocked':
        return 'bg-red-50 border-red-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy HH:mm') : 'Invalid date';
  };

  return (
    <li>
      <div className="relative pb-8">
        {!isLast && (
          <span
            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        )}
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center ring-8 ring-white">
              {getStatusIcon()}
            </span>
          </div>
          <div className={`flex-1 min-w-0 pt-1.5 ${getStatusColor()} rounded-lg border p-4`}>
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-900">{event.title}</p>
              <time
                dateTime={event.timestamp}
                className="text-sm text-gray-500"
              >
                {formatDate(event.timestamp)}
              </time>
            </div>
            <p className="mt-2 text-sm text-gray-600">{event.description}</p>
            
            {event.fileUrl && (
              <div className="mt-2">
                <a
                  href={event.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Lihat Lampiran
                </a>
              </div>
            )}

            {event.responses?.length > 0 && (
              <div className="mt-4 space-y-3">
                {event.responses?.map(response => (
                  <div
                    key={response.id}
                    className="bg-white rounded border border-gray-100 p-3"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {response.author}
                      </span>
                      <time
                        dateTime={response.timestamp}
                        className="text-xs text-gray-500"
                      >
                        {formatDate(response.timestamp)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{response.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default TimelineItem;