import { Task } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Grip } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { useTaskContext } from '../../context/TaskContext';

interface TaskCardProps {
  task: Task;
  // onClick: () => void;

}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTaskStatus } = useTaskContext();
  // const { getIngredientsByIds } = useIngredientContext();
  
  // const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  // const totalSubtasks = task.subtasks.length;
  
  

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ status: string }>();
      if (item && dropResult) {
        updateTaskStatus(item.id, dropResult.status as any);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  //   opacity: isDragging ? 0.5 : 1,
  // };

  

  

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <Link to={`/task/${task.id}`} className="block">
    <div
      ref={drag}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 cursor-move p-4 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ width: '100%' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
          {getStatusText(task.status)}
        </span>
        <div className="flex items-center justify-between">
          {/* <Link to={`/admin/tasks/${task.id}`} className="block">
            <ArrowRight size={16} className="mr-1" />
          </Link> */}
          <Grip
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600"
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
      </Link>
  );
};

export default TaskCard;
