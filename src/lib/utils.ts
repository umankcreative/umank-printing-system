import { Category, ProductImage } from '../types/api';

// Utility function to map API product to local Product type
export function mapApiProductToLocalProduct(p: any, categories: Category[], backendBaseURL: string) {
  return {
    ...p,
    description: p.description || '',
    min_order: p.min_order || 0,
    stock: p.stock || 0,
    is_active: p.is_active ?? true,
    paper_type: p.paper_type || null,
    paper_grammar: p.paper_grammar || null,
    print_type: p.print_type || "Full Color",
    finishing_type: p.finishing_type || 'Tanpa Finishing',
    custom_finishing: p.custom_finishing || null,
    is_paper_enabled: p.is_paper_enabled ?? false,
    is_printing_enabled: p.is_printing_enabled ?? false,
    is_finishing_enabled: p.is_finishing_enabled ?? false,
    category: categories.find(cat => cat.id === p.category_id) ? {
      id: p.category_id,
      name: categories.find(cat => cat.id === p.category_id)?.name || 'Unknown Category',
      description: categories.find(cat => cat.id === p.category_id)?.description || '',
      slug: categories.find(cat => cat.id === p.category_id)?.name.toLowerCase().replace(/\s+/g, '-') || '',
      type: 'product',
      is_active: categories.find(cat => cat.id === p.category_id)?.is_active || true,
      created_at: categories.find(cat => cat.id === p.category_id)?.created_at || new Date().toISOString(),
      updated_at: categories.find(cat => cat.id === p.category_id)?.updated_at || new Date().toISOString()
    } : undefined,
    thumbnail_id: p.thumbnail_id || '', // must be string, not null
    additional_images: p.additional_images?.map((img: ProductImage) => ({
      id: img.id,
      url: `${backendBaseURL}/${img.url}`,
      is_primary: img.is_primary,
      created_at: img.created_at,
      updated_at: img.updated_at
    })) || []
  };
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Order, Task, Product, TaskTemplate } from '../types';
import { v4 as uuidv4 } from 'uuid';

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
    id: uuidv4(),
    title: `Order #${order.id.slice(0, 8)} - ${order.customer.name}`,
    description: `Proses order milik ${order.customer.name}. Harus selesai sebelum Tanggal : ${order.delivery_date}`,
    status: 'todo',
    deadline: order.delivery_date,
    estimated_time: 2,
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
      item.quantity.toString(),
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
      id: uuidv4(),
      title: `Produksi - Order #${order.id.slice(0, 8)}`,
      description: `Siapkan barang untuk Order #${order.id.slice(
        0,
        8
      )}:\n${order.items
        .map((item) => `- ${item.product.name} (${item.quantity} buah)`)
        .join('\n')}`,
      status: 'todo',
      deadline: order.delivery_date,
      estimated_time: 2,
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
      id: uuidv4(),
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
      estimated_time: taskTemplate.estimated_time || 2,
      priority: taskTemplate.priority || 'medium',
      order_id: orderId,
      ingredient_id: ingredient.id,
      parent_task_id: parentTaskId,
      created_at: now,
      updated_at: now,
    }));
  });

  return {
    id: uuidv4(),
    title: `Produksi ${product.name} - Order #${orderId?.slice(0, 8)}`,
    description: `Siapkan bahan-bahan untuk ${product.name} dari Order #${orderId?.slice(
      0,
      8
    )} sebanyak ${quantity} pcs`,
    status: 'todo',
    deadline,
    estimated_time: 2,
    priority: 'high',
    order_id: orderId,
    parent_task_id: parentTaskId,
    created_at: now,
    updated_at: now,
    subtasks,
  };
};

/**
 * Validates if a string is a valid UUID v4
 * Format: 8-4-4-4-12 hexadecimal characters
 * Example: 123e4567-e89b-12d3-a456-426614174000
 */
export const isValidUUID = (uuid: string): boolean => {
  if (typeof uuid !== 'string' || uuid.length !== 36) {
    return false;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const formatDate = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes > 0 && diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes > 0 && diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours > 0 && diffInHours < 24) return `${diffInHours} jam lalu`;

  const diffInDays = Math.floor(diffInMinutes / 60 * 24);
  if (diffInDays > 24) return `${diffInDays} hari lagi`;
  
  return date.toLocaleDateString('id-ID');
};