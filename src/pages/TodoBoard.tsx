import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  Table as TableIcon,
  ListTodo,
} from 'lucide-react';
import TaskCard from '../components/task/TaskCard';
import { TaskCalendar } from '../components/task/TaskCalendar';
import { TaskColumn } from '../components/task/TaskColumn';
import { TaskTable } from '../components/task/TaskTable';
import { TaskDialog } from '../components/task/TaskDialog';
import { Pagination } from '../components/task/Pagination';
import { Task, TaskStatus } from '../types';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  closestCorners,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { useTaskContext } from '../context/TaskContext';
// import { createPortal } from 'react-dom';
import KanbanBoard from '../components/task/KanbanBoard';

const DroppableContainer = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
};

const TodoBoard: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    pagination,
    updateTaskStatus, 
    addTask, 
    updateTask, 
    deleteTask, 
    fetchTasks,
    goToNextPage,
    goToPrevPage,
    goToPage
  } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'calendar'>('kanban');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks(1, undefined, 15);
  }, [fetchTasks]);

  // Add effect to log tasks changes
  useEffect(() => {
    console.log('TodoBoard: Tasks updated:', {
      total: tasks.length,
      byStatus: {
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        closed: tasks.filter(t => t.status === 'closed').length
      }
    });
  }, [tasks]);

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const reviewTasks = tasks.filter(task => task.status === 'review');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const closedTasks = tasks.filter(task => task.status === 'closed');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    console.log('Drag start:', event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (overId.includes('column')) {
      const getStatusFromColumnId = (columnId: string): TaskStatus => {
        if (columnId.startsWith('pending')) return 'pending';
        if (columnId.startsWith('in-progress')) return 'in-progress';
        if (columnId.startsWith('review')) return 'review';
        if (columnId.startsWith('completed')) return 'completed';
        if (columnId.startsWith('closed')) return 'closed';
        return 'pending'; // default status
      };

      const newStatus = getStatusFromColumnId(overId);
      console.log('TodoBoard: Updating task status:', {
        taskId,
        fromColumn: overId,
        newStatus
      });
      
      try {
        await updateTaskStatus(taskId, newStatus);
        console.log('TodoBoard: Status update completed');
      } catch (error) {
        console.error('TodoBoard: Error updating status:', error);
      }
    }
  };

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

  const handleOpenDialogWithDate = (date: Date) => {
    setSelectedDate(date);
    const task: Task = {
    id: 'new',
    title: '',
    description: '',
    priority: 'medium',
      status: 'pending',
      category: 'other',
      deadline: date.toISOString(),
      assignee: null,
      ingredient_id: null,
      order_id: null,
      parent_task_id: null,
      estimated_time: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
      ingredient: null,
      order: null,
      parent_task: null,
      child_tasks: [],
      timeline_events: [],
      task_responses: [],
      task_assignments: [],
    };
    handleOpenDialog(task);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading tasks</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }


  

  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <ListTodo className="h-6 w-6" />
              Halaman Tugas
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Pengelola tugas untuk Umank Creative staff yang sedang berjalan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) =>
              value && setViewMode(value as 'kanban' | 'table' | 'calendar')
            }
          >
            <ToggleGroupItem value="kanban" aria-label="Kanban view">
              <LayoutGrid size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <TableIcon size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="Calendar view">
              <Calendar size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="flex items-center gap-2">
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
            <button className="p-2 hover:bg-muted rounded-md">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' && (
      <>
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
      </>
      )}
      {viewMode === 'table' && (
        <>
        <div className="overflow-hidden pb-4">
          <TaskTable tasks={tasks} onTaskClick={handleOpenDialog} />
        </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={goToPage}
            onNextPage={goToNextPage}
            onPrevPage={goToPrevPage}
          />
        </>
      )}
      {viewMode === 'calendar' && (
        <>
        <div className="overflow-auto pb-4 h-[calc(100vh-200px)]">
          <TaskCalendar
            tasks={tasks}
            onAddTask={handleOpenDialogWithDate}
            onTaskClick={handleOpenDialog}
          />
        </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={goToPage}
            onNextPage={goToNextPage}
            onPrevPage={goToPrevPage}
          />
        </>
      )}
      {selectedDate && (
        <p className="text-sm text-none text-gray-600 mt-2">
          Selected date: {selectedDate.toLocaleDateString()}
        </p>
      )}
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

export default TodoBoard;