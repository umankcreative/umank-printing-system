import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import TimelineItem from './TimelineItem';
import NewEventForm from './NewEventForm';
import ResponseForm from './ResponseForm';

interface TimelineProps {
  taskId: string;
}

const Timeline: React.FC<TimelineProps> = ({ taskId }) => {
  const { getTaskEvents } = useTaskContext();
  const events = getTaskEvents(taskId);

  return (
    <div className="space-y-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {events.map((event, eventIdx) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLast={eventIdx === events.length - 1}
            />
          ))}
        </ul>
      </div>
      <NewEventForm taskId={taskId} />
      {/* <ResponseForm taskId={taskId} /> */}
    </div>
  );
};

export default Timeline;
