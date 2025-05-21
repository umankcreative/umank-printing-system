// Existing types...
export interface TimelineEvent {
  id: string;
  taskId: string;
  title: string;
  description: string;
  status: TaskStatus;
  timestamp: string;
  fileUrl?: string;
  fileType?: string;
  responses: TimelineResponse[];
}

export interface TimelineResponse {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  fileUrl?: string;
  fileType?: string;
}

// export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';
export type TaskStatus =
  | 'pending'
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'closed'
  | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory =
  | 'preparation'
  | 'cooking'
  | 'service'
  | 'cleaning'
  | 'other';

export const ORDER_CATEGORIES = [
  'pending',
  'processing',
  'ready',
  'delivered',
  'cancelled',
];

export const PRODUCT_CATEGORIES = [
  'Kartu Nama',
  'Brosur',
  'Flyer',
  'Poster',
  'Banner',
  'Stiker',
  'Undangan',
  'Kalender',
  'Amplop',
  'Nota',
  'Kop Surat',
  'Yasin',
  'Lainnya',
];

export interface CartItem extends Product {
  quantity: number;
}

export interface TaskTemplate {
  title: string;
  description: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  estimatedTime?: number; // In minutes
}

// Update existing Task interface
export interface Task extends TaskTemplate {
  id: string;
  status: TaskStatus;
  deadline: string;
  // dueDate?: string; //remove this later
  assignee?: string;
  ingredient_id?: string;
  order_id?: string;
  parent_task_id?: string;
  created_at: string;
  updated_at: string;
  subtasks?: Task[];
  comments?: Comment[];
  timeline?: TimelineEvent[];
  responses?: TaskResponse[];
}

export interface TaskResponse {
  id: string;
  author?: string;
  content: string;
  timestamp: string;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  unit: string;
  price_per_unit: number;
  stock: number;
  branch_id: string;
  created_at: string;
  updated_at: string;
  taskTemplates?: TaskTemplate[];
}

// export interface ProductWithExtras extends Product {
//   images?: ProductImage[];
//   ingredients?: {
//     ingredient: Ingredient[];
//     quantity: string;
//   }[];
// }

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  order_date: string;
  delivery_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost_price: number;
  stock: number;
  minOrder: number;
  isActive: boolean;
  branch_id: string;
  thumbnail_id?: string;
  created_at: string;
  updated_at: string;
  ingredients?: RecipeIngredient[];
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  ingredient: Ingredient;
  quantity: number;
}

// export interface RecipeIngredient {
//   id: string;
//   product_id: string;
//   ingredient_id: string;
//   ingredient: Ingredient;
//   quantity: string;
//   created_at: string;
//   updated_at: string;
// }
