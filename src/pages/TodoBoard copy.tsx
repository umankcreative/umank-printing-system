import React, { useState } from 'react';
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
import { createPortal } from 'react-dom';

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
  const { tasks, updateTaskStatus, addTask, updateTask, deleteTask } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'calendar'>('kanban');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (overId.includes('column')) {
      const newStatus = overId.split('-')[0] as TaskStatus;
      updateTaskStatus(taskId, newStatus);
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

  const handleAddTask = (newTask: Task) => {
    addTask(newTask);
    handleCloseDialog();
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);
    handleCloseDialog();
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    handleCloseDialog();
  };

  const createTaskStub = (status: TaskStatus): Task => ({
    id: 'new',
    title: '',
    description: '',
    priority: 'medium',
    estimated_time: 2,
    status,
    deadline: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const handleOpenDialogWithDate = (date: Date) => {
    setSelectedDate(date);
    handleOpenDialog(createTaskStub('todo'));
  };

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
              onClick={() => handleOpenDialog(createTaskStub('todo'))}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableContainer id="todo-column">
                <TaskColumn
                  title="To Do"
                  count={todoTasks.length}
                  status="todo"
                  tasks={todoTasks}
                  onAddTask={() => handleOpenDialog(createTaskStub('todo'))}
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id="in-progress-column">
                <TaskColumn
                  title="In Progress"
                  count={inProgressTasks.length}
                  status="in-progress"
                  tasks={inProgressTasks}
                  onAddTask={() => handleOpenDialog(createTaskStub('in-progress'))}
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id="review-column">
                <TaskColumn
                  title="Review"
                  count={reviewTasks.length}
                  status="review"
                  tasks={reviewTasks}
                  onAddTask={() => handleOpenDialog(createTaskStub('review'))}
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id="completed-column">
                <TaskColumn
                  title="Completed"
                  count={completedTasks.length}
                  status="completed"
                  tasks={completedTasks}
                  onAddTask={() => handleOpenDialog(createTaskStub('completed'))}
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id="closed-column">
                <TaskColumn
                  title="Closed"
                  count={closedTasks.length}
                  status="closed"
                  tasks={closedTasks}
                  onAddTask={() => handleOpenDialog(createTaskStub('closed'))}
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
            </SortableContext>
          </div>
          {typeof document !== 'undefined' &&
            createPortal(
              <DragOverlay>
                {activeId ? (
                  <TaskCard
                    task={tasks.find((t) => t.id === activeId)!}
                    onClick={() => {}}
                  />
                ) : null}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      )}
      {viewMode === 'table' && (
        <div className="overflow-hidden pb-4">
          <TaskTable tasks={tasks} onTaskClick={handleOpenDialog} />
        </div>
      )}
      {viewMode === 'calendar' && (
        <div className="overflow-auto pb-4 h-[calc(100vh-200px)]">
          <TaskCalendar
            tasks={tasks}
            onAddTask={handleOpenDialogWithDate}
            onTaskClick={handleOpenDialog}
          />
        </div>
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