import React from 'react';
import { useDrop } from 'react-dnd';
import { Task, TaskStatus } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  color: string;
    count: number;
    tasks: Task[];
    onAddTask: (status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, color, count, onAddTask, onTaskClick }) => {
  const { getTasksByStatus } = useTaskContext();
  const tasks = getTasksByStatus(status);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: () => ({ status }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    
    <div
      ref={drop}
      className={`flex flex-col h-full bg-gray-50 rounded-lg ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            <span className="ml-2 py-0.5 px-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {count}
            </span>
          </div>
          <button 
            onClick={() => onAddTask(status)}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-400">
            <p className="text-sm">No tasks</p>
            <button 
              onClick={() => onAddTask(status)}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700"
            >
              + Add task
            </button>
          </div>
        )}
      </div>
      </div>
      
  );
};

interface KanbanBoardProps {
    onAddTask: (status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onAddTask, onTaskClick }) => {
  const { tasks } = useTaskContext();
  
  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'pending', title: 'Pending', color: 'bg-gray-400' },
    { status: 'todo', title: 'Todo', color: 'bg-blue-400' },
    { status: 'in-progress', title: 'In Progress', color: 'bg-yellow-400' },
    { status: 'review', title: 'Review', color: 'bg-purple-400' },
    { status: 'completed', title: 'Completed', color: 'bg-green-400' },
    { status: 'closed', title: 'Closed', color: 'bg-gray-400' },
    { status: 'blocked', title: 'Blocked', color: 'bg-red-400' },
  ];

  const countTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 h-[calc(100vh-12rem)]">
      {columns.map(({ status, title, color }) => (
        <KanbanColumn
          key={status}
          tasks={tasks}
          status={status}
          title={title}
          color={color}
          count={countTasksByStatus(status)}
          onAddTask={onAddTask}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;