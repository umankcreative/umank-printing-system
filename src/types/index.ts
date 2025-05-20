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

// Update existing Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  estimatedTime: number; // In minutes
  dueDate?: string; //remove this later
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
  NamaBahan: string;
  Deskripsi: string;
  Satuan: string;
  HargaPerSatuan: string;
  Stok: string;
  id_cabang: string;
  created_at: string;
  updated_at: string;
  tasks?: Array<{
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
  }>;
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
  total_amount: string;
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
  quantity: string;
  price: string;
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
  NamaProduk: string;
  Deskripsi: string;
  category: string;
  thumbnail_id: string | null;
  HargaModal: string;
  Harga: string;
  minOrder: string;
  Stok: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  ingredients?: RecipeIngredient[];
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  image: string;
  product_id: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient extends Ingredient {
  product_id: string;
  ingredient: Ingredient;
  quantity: string;
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
