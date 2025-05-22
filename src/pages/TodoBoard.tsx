import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  Table as TableIcon,
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
  // arrayMove,
} from '@dnd-kit/sortable';

// import { toast } from 'sonner';
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
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'column', // penting untuk membedakan drop target
    },
  });

  return <div ref={setNodeRef}>{children}</div>;
};

const TaskBoard: React.FC = () => {
  const { tasks, addTask, deleteTask, updateTask, updateTaskStatus } =
    useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'calendar'>(
    'kanban'
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  // const [showTaskForm, setShowTaskForm] = useState(false);
  // const [editingTask, setEditingTask] = useState<Task | undefined>();

  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const reviewTasks = tasks.filter((task) => task.status === 'review');
  const completedTasks = tasks.filter((task) => task.status === 'completed');
  const closedTasks = tasks.filter((task) => task.status === 'closed');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
    } else {
      setSelectedTask(null);
    }
    setIsDialogOpen(true);
    // console.log(task);
  };

  const handleOpenDialogWithDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = (
    newTask: Task
    // newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ) => {
    addTask(newTask);
    handleCloseDialog();
    // toast.success('Task added successfully!');
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);
    handleCloseDialog();
    // toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    handleCloseDialog();
    // toast.success('Task deleted successfully!');
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setSelectedTask(task);
      setActiveId(event.active.id as string);
    }
  };

  const columnStatusMap: Record<string, Task['status']> = {
    'todo-column': 'todo',
    'in-progress-column': 'in-progress',
    'review-column': 'review',
    'completed-column': 'completed',
    'closed-column': 'closed',
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const isDroppingOnColumn = over?.data?.current?.type === 'column';
    if (isDroppingOnColumn) {
      const newStatus = columnStatusMap[over.id as string];
      const task = tasks.find((t) => t.id === active.id);

      if (task && newStatus && task.status !== newStatus) {
        updateTaskStatus(active.id as string, newStatus);
      } else {
        // console.warn('Unknown drop target:', over.id);
      }
    }

    setSelectedTask(null);
    setActiveId(null);
  };

  const createTaskStub = (
    status: TaskStatus
  ): Omit<Task, 'id' | 'created_at' | 'updated_at'> => {
    return {
      title: '',
      description: '',
      status,
      priority: 'medium',
      category: 'preparation',
      estimatedTime: 2,
      deadline: new Date().toISOString().split('T')[0],
      subtasks: [],
    };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengelola Tugas</h1>
            {/* <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
            <span className="text-sm font-medium">All</span>
            <span className="text-xs text-muted-foreground">
              ({tasks.length})
            </span>
          </div> */}
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
              onClick={() => handleOpenDialog()}
              className="btn btn-outline-primary  gap-2  flex items-center justify-center h-full m-auto"
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
            {/* <DroppableContainer id={`${status}-container`}> */}
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableContainer id={`todo-column`}>
                <TaskColumn
                  title="To Do"
                  count={todoTasks.length}
                  status="todo"
                  tasks={todoTasks}
                  onAddTask={() =>
                    handleOpenDialog(createTaskStub('todo') as Task)
                  }
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id={`in-progress-column`}>
                <TaskColumn
                  title="In Progress"
                  count={inProgressTasks.length}
                  status="in-progress"
                  tasks={inProgressTasks}
                  onAddTask={() =>
                    handleOpenDialog(createTaskStub('in-progress') as Task)
                  }
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id={`review-column`}>
                <TaskColumn
                  title="Review"
                  count={reviewTasks.length}
                  status="review"
                  tasks={reviewTasks}
                  onAddTask={() =>
                    handleOpenDialog(createTaskStub('review') as Task)
                  }
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id={`completed-column`}>
                <TaskColumn
                  title="Completed"
                  count={completedTasks.length}
                  status="completed"
                  tasks={completedTasks}
                  onAddTask={() =>
                    handleOpenDialog(createTaskStub('completed') as Task)
                  }
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
              <DroppableContainer id={`closed-column`}>
                <TaskColumn
                  title="Closed"
                  count={closedTasks.length}
                  status="closed"
                  tasks={closedTasks}
                  onAddTask={() =>
                    handleOpenDialog(createTaskStub('closed') as Task)
                  }
                  onTaskClick={handleOpenDialog}
                />
              </DroppableContainer>
            </SortableContext>
            {/* </DroppableContainer> */}
          </div>
          {typeof document !== 'undefined' &&
            createPortal(
              <DragOverlay>
                {activeId ? (
                  <TaskCard
                    task={tasks.find((t) => t.id === activeId)!}
                    onStatusChange={handleStatusChange}
                    onEdit={() => {}}
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
          Tanggal dipilih: {selectedDate.toLocaleDateString()}
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

export default TaskBoard;
