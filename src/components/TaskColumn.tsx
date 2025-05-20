import { Task, TaskStatus } from '../types';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';
// import { useSortable } from '@dnd-kit/sortable';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
// import { useDroppable } from '@dnd-kit/core';

// const DroppableContainer = ({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) => {
//   const { setNodeRef } = useDroppable({ id });
//   return <div ref={setNodeRef}>{children}</div>;
// };

interface TaskColumnProps {
  title: string;
  count: number;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

export function TaskColumn({
  title,
  count,
  status,
  tasks,
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="task-column">
      <div key={status} className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon status={status} />
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground">({count})</span>
        </div>
        <div className="flex items-center">
          <button className="p-1 hover:bg-muted rounded-md">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div
        className={`flex  flex-col gap-2 min-h-[500px] transition-colors ${
          isDragging ? 'bg-muted/70' : ''
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="h-[500px] flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Geser tugas ke sini
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))
          )}
        </SortableContext>
      </div>

      <button onClick={onAddTask} className="add-task-btn mt-2">
        <Plus size={16} />
        <span>Add Task</span>
      </button>
    </div>
  );
}

function StatusIcon({ status }: { status: TaskStatus }) {
  const columnIconColors = {
    todo: 'bg-gray-400',
    'in-progress': 'bg-blue-400',
    review: 'bg-yellow-400',
    completed: 'bg-green-400',
    closed: 'bg-gray-400',
  };

  return <div className={`w-3 h-3 rounded-full ${columnIconColors[status]}`} />;
}
