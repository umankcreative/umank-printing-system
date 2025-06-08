import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Share2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { supabase } from '../lib/supabase';
import PublicTimeline from '../components/timeline/PublicTimeline';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  created_at: string;
  assignee_id?: string;
}

const PublicTaskPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (shareId) {
      fetchTask();
    }
  }, [shareId]);
  
  const fetchTask = async () => {
    try {
      // Use exact match with the full task ID
      const { data, error } = await supabase
        .from('tasks1')
        .select(`
          id,
          title,
          description,
          status,
          dueDate,
          created_at,
          assignee_id
        `)
        .eq('id', shareId)
        .limit(1);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Task not found');
      }
      
      setTask(data[0]);
      
      if (data[0]) {
        document.title = `${data[0].title} - Shared Task`;
      }
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('Task not found or no longer available');
    } finally {
      setLoading(false);
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
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The task you're looking for doesn't exist or is no longer available."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Share2 className="h-6 w-6" />
            <span className="text-xl font-bold">TaskShare</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusClass(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 border-t border-gray-100 pt-6">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Dibuat</p>
                  <p className="font-medium">{formatDate(task.created_at)}</p>
                </div>
              </div>
              
              {task.dueDate && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Tenggat Waktu</p>
                    <p className="font-medium">{formatDate(task.dueDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <PublicTimeline taskId={task.id} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Share2 className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">TaskShare</span>
          </div>
          <p className="text-gray-600">Bagikan progres tugas dengan mudah</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicTaskPage;