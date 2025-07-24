import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  Table as TableIcon,
  ListTodo,
} from 'lucide-react';
import { TaskCalendar } from '../components/task/TaskCalendar';
import { TaskTable } from '../components/task/TaskTable';
import { TaskDialog } from '../components/task/TaskDialog';
import { Pagination } from '../components/task/Pagination';
import { Task } from '../types'; // Pastikan Task type Anda diimpor
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { useTaskContext } from '../context/TaskContext'; // Gunakan TaskContext yang sudah dimodifikasi
import KanbanBoard from '../components/task/KanbanBoard'; // Impor KanbanBoard

const TodoBoard: React.FC = () => {
  // Destructure properti dari useTaskContext.
  // isLoading, isError, dan error sekarang berasal dari react-query
  const {
    tasks,
    isLoading, // Menggantikan 'loading'
    isError,   // Menggantikan 'error' (boolean)
    error,     // Objek error jika isError true
    pagination,
    addTask,
    updateTask,
    deleteTask,
    // fetchTasks tidak lagi diperlukan secara eksplisit di sini untuk fetching awal,
    // tapi fungsi goToNextPage, goToPrevPage, goToPage tetap relevan untuk navigasi.
    goToNextPage,
    goToPrevPage,
    goToPage
  } = useTaskContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'calendar'>('kanban');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // useEffect ini tidak lagi diperlukan untuk fetching data awal,
  // karena useQuery di TaskContext akan otomatis memuat data saat Provider di-mount.
  // Namun, jika Anda memiliki dependensi filter atau sort yang ingin diubah di sini
  // dan memicu fetch ulang, Anda bisa menggunakan `setQueryParams` dari context
  // jika Anda mengeksposnya (saat ini tidak diekspos langsung, tapi melalui goToPage dll).
  // useEffect(() => {
  //   // Parameter `1` (page) dan `undefined` (status) adalah default, jadi tidak perlu panggil ini lagi
  //   // jika useQuery sudah diatur untuk mengambil data default pada mount.
  //   // Jika Anda memiliki filter awal yang spesifik, Anda bisa atur `setQueryParams` di sini
  //   // Misalnya: setQueryParams({ page: 1, status: 'pending' });
  // }, []); // Hapus `fetchTasks` dari dependensi karena sudah tidak ada di scope ini

  // Add effect to log tasks changes - Tetap berguna untuk debugging
  useEffect(() => {
    console.log('TodoBoard: Tasks updated:', {
      total: tasks.length,
      byStatus: {
        pending: tasks.filter(t => t.status === 'pending').length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        closed: tasks.filter(t => t.status === 'closed').length
      }
    });
  }, [tasks]);

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
      // Panggil addTask dari context
      await addTask({
        ...newTask,
        category: newTask.category || 'other',
        ingredient_id: newTask.ingredient_id || null, // Pastikan ini sesuai dengan tipe
        estimated_time: newTask.estimated_time || null, // Pastikan ini sesuai dengan tipe
        assignee: newTask.assignee || null, // Pastikan ini sesuai dengan tipe
        order_id: newTask.order_id || null, // Pastikan ini sesuai dengan tipe
        parent_task_id: newTask.parent_task_id || null // Pastikan ini sesuai dengan tipe
      });
      handleCloseDialog();
    } catch (e) {
      // Error handling sudah dilakukan di context
      console.error("Error in TodoBoard handleAddTask:", e);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      // Panggil updateTask dari context
      await updateTask(updatedTask);
      handleCloseDialog();
    } catch (e) {
      // Error handling sudah dilakukan di context
      console.error("Error in TodoBoard handleUpdateTask:", e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      // Panggil deleteTask dari context
      await deleteTask(taskId);
      handleCloseDialog();
    } catch (e) {
      // Error handling sudah dilakukan di context
      console.error("Error in TodoBoard handleDeleteTask:", e);
    }
  };

  const handleOpenDialogWithDate = (date: Date) => {
    setSelectedDate(date);
    const task: Task = {
      id: 'new', // Akan diganti di backend
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      category: 'other',
      deadline: date.toISOString(), // Atur deadline sesuai tanggal yang dipilih
      assignee_id: null,
      ingredient_id: null,
      order_id: null,
      parent_task_id: null,
      estimated_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Properti lain yang mungkin diperlukan atau harus diset default
      assignee: null,
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

  // Menggunakan isLoading dari useTaskContext
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="text-lg">Memuat tugas...</div>
      </div>
    );
  }

  // Menggunakan isError dan error dari useTaskContext
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Gagal memuat tugas</p>
          <p className="text-sm">{error?.message || 'Terjadi kesalahan tidak diketahui.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4"> {/* Tambahkan container & padding */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-6"> {/* Hapus md:w-[80%] */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full"> {/* Tambahkan w-full */}
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
        <div className="flex items-center gap-4 mt-4 md:mt-0"> {/* Tambahkan margin top untuk mobile */}
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
              onClick={() => handleOpenDialogWithDate(new Date())} // Menggunakan tanggal saat ini untuk task baru
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="-ml-1 mr-2" />
              <span>Tambah Tugas Baru</span>
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada tugas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Mulai dengan membuat tugas baru.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleOpenDialogWithDate(new Date())}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus size={16} className="-ml-1 mr-2" />
                Buat Tugas Baru
              </button>
            </div>
          </div>
        </div>
      ) : (
        // KanbanBoard akan menerima data tasks dari context
        <KanbanBoard tasks={tasks} onTaskClick={handleOpenDialog} /> 
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
          Tanggal terpilih: {selectedDate.toLocaleDateString('id-ID')}
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