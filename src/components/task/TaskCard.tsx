import { Task } from '../../types';
import {
  CheckSquare,
  MessageSquare,
  ArrowRight,
  Calendar,
  Grip,
} from 'lucide-react';
// import { format, formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

// interface TaskCardProps {
//   task: Task;
//   onStatusChange: (taskId: string, newStatus: Task['status']) => void;
//   onEdit: (task: Task) => void;
// }

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  // const TaskCard({ task, onClick }: TaskCardProps) {
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

  // const timeAgo = formatDistanceToNow(new Date(task.created_at), {
  //   addSuffix: true,
  // });

  const completedSubtasks =
    task.subtasks?.filter((st) => st.status === 'completed').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card group rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-all duration-200 ${
        task.parent_task_id
          ? 'ml-2 bg-blue-50 border-l-4 border-blue-300'
          : 'bg-white'
      }`}
      onClick={(e) => {
        e.preventDefault();
        // onEdit(task);
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
          {getStatusText(task.status)}
        </span>
        <Grip
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <div onClick={onClick} className="cursor-pointer">
        <h4 className="font-medium mb-1 text-left">{task.title}</h4>
        {task.description && (
          <p className="text-sm mb-2 text-left line-clamp-2">
            {task.description}
          </p>
        )}
        {/* <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs">
            <Clock size={12} />
            <span>{timeAgo}</span>
          </div>
        </div> */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="flex items-center">
                <CheckSquare size={16} className="mr-1" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
            )}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-1" />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 text-xs text-red-400" />
            <span className="text-red-400 text-xs">
              {format(new Date(task.deadline), 'MMM d')}
            </span>
          </div>
          <Link to={`/admin/tasks/${task.id}`} className="block">
            <ArrowRight size={16} className="mr-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
