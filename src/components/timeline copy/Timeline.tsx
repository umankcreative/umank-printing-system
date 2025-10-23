import React, { useState, useEffect } from 'react';
import TimelineItem from './TimelineItem';
import { PlusCircle, CheckCircle } from 'lucide-react';
import NewEventForm from './NewEventForm';
// import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface TimelineProps {
  taskId: string;
}

const Timeline: React.FC<TimelineProps> = ({ taskId }) => {
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    subscribeToEvents();
  }, [taskId]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToEvents = () => {
    const subscription = supabase
      .channel('timeline_events_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timeline_events',
          filter: `task_id=eq.${taskId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents(prev => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleVerifyCompletion = async () => {
    setIsVerifying(true);
    setVerificationMessage(null);

    try {
      const { data: latestEvent } = await supabase
        .from('timeline_events')
        .select('status')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const isCompleted = latestEvent?.status === 'completed';

      if (isCompleted) {
        await supabase
          .from('tasks1')
          .update({ status: 'completed' })
          .eq('id', taskId);

        setVerificationMessage('All activities have been verified as complete!');
        toast.success('Task marked as complete!');
      } else {
        setVerificationMessage('Some items are still pending completion.');
        toast.error('Task is not yet complete');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationMessage('An error occurred during verification.');
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Progress Timeline</h2>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 transition"
            onClick={handleVerifyCompletion}
            disabled={isVerifying}
          >
            <CheckCircle className="h-5 w-5" />
            <span>{isVerifying ? 'Verifying...' : 'Verify Completion'}</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition"
            onClick={() => setShowNewEventForm(!showNewEventForm)}
          >
            <PlusCircle className="h-5 w-5" />
            <span>{showNewEventForm ? 'Cancel' : 'Add Update'}</span>
          </button>
        </div>
      </div>

      {verificationMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          verificationMessage.includes('complete') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          {verificationMessage}
        </div>
      )}

      {showNewEventForm && (
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100 animate-fadeIn">
          <NewEventForm 
            taskId={taskId} 
            onSubmitted={() => setShowNewEventForm(false)} 
          />
        </div>
      )}

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 mt-4">
            <p className="text-gray-500">No updates have been posted yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event, index) => (
              <TimelineItem 
                key={event.id} 
                event={event} 
                taskId={taskId}
                isLast={index === events.length - 1} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;