import React, { useState, useEffect } from 'react';
import PublicTimelineItem from './PublicTimelineItem';
// import { supabase } from '../../lib/supabase';

interface PublicTimelineProps {
  taskId: string;
}

const PublicTimeline: React.FC<PublicTimelineProps> = ({ taskId }) => {
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
    } finally {
      setLoading(false);
    }
  };

  const subscribeToEvents = () => {
    const subscription = supabase
      .channel('public_timeline_events_channel')
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
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => prev.map(event => 
              event.id === payload.new.id ? payload.new : event
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Progress Timeline</h2>
        <p className="text-gray-600 mt-1">Ikuti perkembangan tugas ini secara real-time</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 mt-4">
            <p className="text-gray-500">Belum ada update yang diposting.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event, index) => (
              <PublicTimelineItem 
                key={event.id} 
                event={event} 
                isLast={index === events.length - 1} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicTimeline;