import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Order, Task, Product, TaskTemplate } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

export const generateOrderTasks = (order: Order, products: Product[]): Task[] => {
  const now = new Date().toISOString();
  const tasks: Task[] = [];

  const mainTask: Task = {
    id: crypto.randomUUID(),
    title: `Order #${order.id.slice(0, 8)} - ${order.customer.name}`,
    description: `Proses order milik ${order.customer.name}. Harus selesai sebelum Tanggal : ${order.delivery_date}`,
    status: 'todo',
    deadline: order.delivery_date,
    estimatedTime: 2,
    priority: 'high',
    order_id: order.id,
    created_at: now,
    updated_at: now,
    subtasks: [],
  };

  order.items.forEach((item) => {
    const productTask = generateTaskForProduct(
      products,
      item.product_id,
      item.quantity,
      order.delivery_date,
      order.id,
      mainTask.id
    );

    if (productTask) {
      mainTask.subtasks?.push(productTask);
    }
  });

  // Jika tidak ada subtasks dari produk, buat default task
  if (!mainTask.subtasks?.length) {
    mainTask.subtasks?.push({
      id: crypto.randomUUID(),
      title: `Produksi - Order #${order.id.slice(0, 8)}`,
      description: `Siapkan barang untuk Order #${order.id.slice(
        0,
        8
      )}:\n${order.items
        .map((item) => `- ${item.product.name} (${item.quantity} buah)`)
        .join('\n')}`,
      status: 'todo',
      deadline: order.delivery_date,
      estimatedTime: 2,
      priority: 'high',
      order_id: order.id,
      parent_task_id: mainTask.id,
      created_at: now,
      updated_at: now,
    });
  }

  tasks.push(mainTask);
  return tasks;
};

export const generateTaskForProduct = (
  products: Product[],
  productId: string,
  quantity: string,
  deadline: string,
  orderId?: string,
  parentTaskId?: string
): Task | undefined => {
  const product = products.find((p) => p.id === productId);
  if (!product || !product.ingredients) return undefined;

  const now = new Date().toISOString();

  const subtasks: Task[] = product.ingredients.flatMap((recipeIngredient) => {
    const ingredient = recipeIngredient.ingredient;
    if (!ingredient || !ingredient.taskTemplates) return [];

    return ingredient.taskTemplates.map((taskTemplate: TaskTemplate) => ({
      id: crypto.randomUUID(),
      title: `${taskTemplate.title} - untuk ${
        product.name
      } dari Order #${orderId?.slice(
        0,
        8
      )} sebanyak ${quantity} pcs \n `,
      description: `${taskTemplate.description} untuk Order #${orderId?.slice(
        0,
        8
      )} sebanyak ${quantity} pcs \n Harus selesai sebelum tanggal : ${deadline} `,
      status: 'todo',
      deadline,
      estimatedTime: taskTemplate.estimatedTime || 2,
      priority: taskTemplate.priority || 'medium',
      order_id: orderId,
      ingredient_id: ingredient.id,
      parent_task_id: parentTaskId,
      created_at: now,
      updated_at: now,
    }));
  });

  return {
    id: crypto.randomUUID(),
    title: `Produksi ${product.name} - Order #${orderId?.slice(0, 8)}`,
    description: `Siapkan bahan-bahan untuk ${product.name} dari Order #${orderId?.slice(
      0,
      8
    )} sebanyak ${quantity} pcs`,
    status: 'todo',
    deadline,
    estimatedTime: 2,
    priority: 'high',
    order_id: orderId,
    parent_task_id: parentTaskId,
    created_at: now,
    updated_at: now,
    subtasks,
  };
};
