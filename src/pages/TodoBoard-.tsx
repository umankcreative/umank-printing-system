import React, { useState } from 'react';
import {
  DndContext,
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
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, Search } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

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
  const { tasks, addTask, updateTaskStatus } = useTaskContext<Task>();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tasksByStatus = {
    pending: filteredTasks.filter((t) => t.status === 'pending'),
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
    review: filteredTasks.filter((t) => t.status === 'review'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
    blocked: filteredTasks.filter((t) => t.status === 'blocked'),
    closed: filteredTasks.filter((t) => t.status === 'closed'),
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };
  // const handleDragOver = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   const activeId = active.id;
  //   const overId = over.id as string;
  //   const activeTask = tasks.find((t) => t.id === activeId);
  //   const overTask = tasks.find((t) => t.id === overId);
  //   if (!over) return;

  //   if (activeId === overId) return;

  //   if (!activeTask || !overTask) return;

  //   if (activeId !== overId) {
  //     const newStatus = overId.replace('-column', '') as Task['status'];
  //     updateTaskStatus(activeId as string, newStatus);
  //     // setTasks(updatedTask);
  //   }
  // };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const overId = over.id as string;
    const newStatus = overId.replace('-container', '') as Task['status'];
    updateTaskStatus(active.id as string, newStatus);
    setActiveId(null);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleTaskSubmit = (task: Task) => {
    if (editingTask) {
      updateTaskStatus(task.id, task.status);
    } else {
      addTask(task);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'In Review';
      case 'completed':
        return 'Completed';
      case 'closed':
        return 'Closed';
      case 'blocked':
        return 'Blocked';
      default:
        return status;
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
          <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
            <span className="text-sm font-medium">All</span>
            <span className="text-xs text-muted-foreground">
              ({tasks.length})
            </span>
          </div>
        </div>
        {/* <p className="text-gray-600 mt-2">Manage tasks with drag and drop</p> */}

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="input pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <button
            className="btn btn-primary flex items-center justify-center"
            onClick={() => setShowTaskForm(true)}
          >
            <Plus size={20} className="mr-2" /> Add Task
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1  md:grid-cols-5 gap-2 p-2">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {getColumnTitle(status)}
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-gray-200 text-blue-600 text-xs rounded-full">
                    {statusTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingTask(undefined);
                    setShowTaskForm(true);
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <DroppableContainer id={`${status}-container`}>
                <SortableContext
                  items={statusTasks}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[600px]">
                    {statusTasks.length === 0 ? (
                      <div className="h-[400px] flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                        Drop tasks here
                      </div>
                    ) : (
                      statusTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onEdit={handleEditTask}
                          className="m-2 border"
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DroppableContainer>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={tasks.find((t) => t.id === activeId)!}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <TaskForm
              onSubmit={handleTaskSubmit}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(undefined);
              }}
              initialTask={editingTask}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoBoard;
