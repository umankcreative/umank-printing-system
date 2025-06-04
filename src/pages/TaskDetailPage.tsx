import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { useOrderContext } from '../context/OrderContext';
import { Task } from '../types';
import { Order as ApiOrder, OrderItem as ApiOrderItem, RecipeIngredient } from '../types/api';
import { formatCurrency } from '../lib/utils';

import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckSquare,
  Package,
  ShoppingCart,
  Utensils,
} from 'lucide-react';
import Timeline from '../components/timeline/Timeline';
import { format } from 'date-fns';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTaskStatus } = useTaskContext();
  const { getOrder } = useOrderContext();
  const [relatedOrder, setRelatedOrder] = useState<ApiOrder | undefined>();

  // Find the task and its parent if it exists
  const task = tasks.find((t) => t.id === id);
  const parentTask = task?.parent_task_id
    ? tasks.find((t) => t.id === task.parent_task_id)
    : undefined;

  useEffect(() => {
    const fetchOrder = async () => {
      if (task?.order_id) {
        try {
          const order = await getOrder(task.order_id);
          if (order) {
            setRelatedOrder(order as unknown as ApiOrder);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      }
    };
    fetchOrder();
  }, [task?.order_id, getOrder]);

  const relatedProduct = relatedOrder?.items
    ?.map((item: ApiOrderItem) => item.product)
    .find((product) =>
      product.ingredients?.some(
        (ri: RecipeIngredient) => ri.id === task?.ingredient_id
      )
    );

  if (!task) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Tugas tidak ditemukan
          </h2>
          <p className="text-gray-500 mb-6">
            Tugas yang kamu cari ngga ada atau udah di hapus.
          </p>
          <button
            onClick={() => navigate('/admin/tasks')}
            className="btn btn-primary"
          >
            Kembali ke daftar Tugas
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-blue-100 text-blue-800',
    todo: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    blocked: 'bg-red-100 text-red-800',
  } as const;

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800',
  } as const;

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTaskStatus(task.id, newStatus);
  };

  const completedSubtasks = task.child_tasks?.filter(st => st.status === 'completed').length || 0;
  const totalSubtasks = task.child_tasks?.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/admin/tasks')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          {parentTask && (
            <Link
              to={`/admin/tasks/${parentTask.id}`}
              className="text-sm text-gray-500 hover:text-gray-700 mb-1 flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to {parentTask.title}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Main Task Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[task.status as keyof typeof statusColors]
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              {task.priority && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    priorityColors[task.priority as keyof typeof priorityColors]
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}{' '}
                  Priority
                </span>
              )}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600">{task.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2" />
                <span>
                  Dibuat: {format(new Date(task.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-2 text-red-400" />
                <span className="text-red-400">
                  Deadline: {task.deadline ? format(new Date(task.deadline), 'MMM d, yyyy') : 'No deadline'}
                </span>
              </div>
            </div>
          </div>

          {/* Child Tasks */}
          {task.child_tasks && task.child_tasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CheckSquare size={20} className="mr-2" />
                Child Tasks ({completedSubtasks}/{totalSubtasks})
              </h2>
              <div className="space-y-3">
                {task.child_tasks.map((childTask) => (
                  <Link
                    key={childTask.id}
                    to={`/admin/tasks/${childTask.id}`}
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {childTask.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {childTask.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          statusColors[childTask.status as keyof typeof statusColors]
                        }`}
                      >
                        {childTask.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Update Progress</h2>
            <Timeline taskId={task.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <div className="space-y-2">
              {(
                [
                  'todo',
                  'in-progress',
                  'review',
                  'completed',
                  'closed',
                ] as Task['status'][]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      task.status === status
                        ? statusColors[status as keyof typeof statusColors]
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Related Information */}
          {(task.ingredient_id || task.order_id) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Related Information
              </h2>
              <div className="space-y-4">
                {task.order_id && relatedOrder && (
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center text-gray-800 font-medium mb-2">
                      <ShoppingCart
                        size={18}
                        className="mr-2 text-purple-600"
                      />
                      Order Details
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-600">ID:</span> #
                        {relatedOrder.id.slice(0, 8)}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Customer:</span>{' '}
                        {relatedOrder.customer?.name}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Total:</span>{' '}
                        {formatCurrency(parseFloat(relatedOrder.total_amount))}
                      </p>
                    </div>
                  </div>
                )}

                {relatedProduct && (
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center text-gray-800 font-medium mb-2">
                      <Package size={18} className="mr-2 text-teal-600" />
                      Product Details
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-600">Name:</span>{' '}
                        {relatedProduct.name}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Price:</span>{' '}
                        {formatCurrency(relatedProduct.price)}
                      </p>
                    </div>
                  </div>
                )}

                {task.ingredient_id && (
                  <div>
                    <div className="flex items-center text-gray-800 font-medium mb-2">
                      <Utensils size={18} className="mr-2 text-amber-600" />
                      Ingredient Task
                    </div>
                    <div className="pl-6">
                      <p className="text-sm text-gray-600">
                        This task is related to ingredient preparation or
                        management
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
