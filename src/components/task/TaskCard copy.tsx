import { Task } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Grip } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'todo':
        return 'todo-badge';
      case 'in-progress':
        return 'inprogress-badge';
      case 'review':
        return 'review-badge';
      case 'completed':
        return 'completed-badge';
      case 'closed':
        return 'closed-badge';
      default:
        return 'todo-badge';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'Review';
      case 'completed':
        return 'Completed';
      case 'closed':
        return 'Closed';
      default:
        return 'To Do';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card group rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-all duration-200 bg-white"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
          {getStatusText(task.status)}
        </span>
        <div className="flex items-center">
          <Link to={`/admin/tasks/${task.id}`} className="block">
            <ArrowRight size={16} className="mr-1" />
          </Link>
          <Grip
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-1 text-left">{task.title}</h4>
        {task.description && (
          <p className="text-sm mb-2 text-left line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
