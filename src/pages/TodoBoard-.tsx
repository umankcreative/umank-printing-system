import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import KanbanBoard from '../components/task/KanbanBoard';
import TaskForm from '../components/task/TaskForm';
import { Task, TaskStatus } from '../types';
import { Dialog } from '@headlessui/react';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { TaskDialog } from '../components/task/TaskDialog';

const Tasks: React.FC = () => {
  const { tasks, addTask } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<TaskStatus>('todo');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const handleOpenDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
    setIsDialogOpen(false);
  };

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addTask({
        ...newTask,
        category: newTask.category || 'other',
        ingredient_id: null,
        estimated_time: null,
        assignee: null,
      });
    handleCloseDialog();
    } catch {
      // Error handling is done in the context
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
    handleCloseDialog();
    } catch {
      // Error handling is done in the context
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    handleCloseDialog();
    } catch {
      // Error handling is done in the context
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Task Board</h1>
        
        <div className="flex space-x-3">
          <div className="relative">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
          
          <div className="relative">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <SortAsc size={16} className="mr-2" />
              Sort
            </button>
          </div>
          
          <button
              onClick={() => handleOpenDialog({
                id: 'new',
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                deadline: new Date().toISOString(),
                order_id: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })}
              className="btn btn-outline-primary gap-2 flex items-center justify-center h-full m-auto"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleAddTask('todo')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus size={16} className="-ml-1 mr-2" />
                New Task
              </button>
            </div>
          </div>
        </div>
      ) : (
        <KanbanBoard onAddTask={handleAddTask} onTaskClick={()=>{}} />
      )}

      {/* Create Task Modal */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        task={selectedTask}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default Tasks;