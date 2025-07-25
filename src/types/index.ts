import { Customer, Branch, OrderItem, Task, Product as ApiProduct } from './api';
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
export type TaskStatus = 'pending' | 'todo' | 'in-progress' | 'review' | 'completed' | 'closed'| 'blocked';

export interface MinimalTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'order' | 'production' | 'other';

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

export interface PaperOption {
  name: string;
  grammars: string[];
}

export const PAPER_OPTIONS: PaperOption[] = [
  { name: 'Art Paper', grammars: ['85gr', '100gr', '115gr', '120gr', '150gr'] },
  {
    name: 'Art Carton',
    grammars: ['190gr', '210gr', '230gr', '260gr', '310gr', '350gr', '400gr'],
  },
  { name: 'Ivory', grammars: ['210gr', '230gr', '250gr', '310gr', '400gr'] },
  {
    name: 'Dupleks',
    grammars: ['250gr', '270gr', '310gr', '350gr', '400gr', '450gr', '500gr'],
  },
  { name: 'HVS', grammars: ['60gr', '70gr', '80gr', '100gr'] },
  { name: 'Samson Kraft', grammars: ['70gr', '80gr'] },
  { name: 'BW', grammars: ['160gr', '220gr', '250gr'] },
  { name: 'Yupo', grammars: ['150gsm'] },
  { name: 'Concorde', grammars: ['120gsm', '250gsm'] },
  { name: 'Mohawk Eggshell', grammars: ['148gsm', '216gsm', '270gsm'] },
  { name: 'Linen Jepang', grammars: ['230gsm'] },
  { name: 'Yellow Board', grammars: ['YB40', 'TB30'] },
  { name: 'Fancy Paper', grammars: ['80gr', '100gr', '220gr', '300gr'] },
  { name: 'Corrugated', grammars: ['100gr'] },
  { name: 'NCR', grammars: ['100gr'] },
];

export interface CartItem extends Product {
  quantity: number;
}

export interface TaskTemplate {
  id: string;
  ingredient_id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
  created_at: string;
  updated_at: string;
}

// Update existing Task interface
// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
//   priority: TaskPriority;
//   category: TaskCategory;
//   deadline: string | null;
//   assignee: string | null;
//   ingredient_id: string | null;
//   order_id: string | null;
//   parent_task_id: string | null;
//   estimated_time: number | null;
//   created_at: string;
//   updated_at: string;
//   ingredient: Ingredient[] | null; // Replace 'any' with proper Ingredient interface if available
//   order: Order | null;
//   parent_task: Task | null;
//   child_tasks: Task[];
//   timeline_events: TimelineEvent[];
//   task_responses: TaskResponse[];
//   task_assignments: TaskAssignment[];
// }

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
  quantity: string;
  unit: string;
  price_per_unit: string;
  stock: number;
  branch_id: string;
  notes: string;
  task_templates: TaskTemplate[];
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
  customer: Customer; // Langsung gunakan Customer dari api.ts
  branch: Branch;     // Langsung gunakan Branch dari api.ts
  items: OrderItem[]; // Langsung gunakan OrderItem dari api.ts
  tasks?: Task[];     // Langsung gunakan Task dari api.ts
  total_amount: number; // Menggunakan number untuk perhitungan di frontend
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid';
  payment_method: 'cash' | 'transfer' | 'debit' | 'credit'; // Ditambahkan 'debit' | 'credit' dari api.ts
  notes: string | null;
  order_date: string; // Perlu memastikan ini ada jika diperlukan
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
  branch_id: string; // Tetap dipertahankan untuk payload
  customer_id: string; // Tetap dipertahankan untuk payload
}

// export interface OrderItem {
//   id: string;
//   order_id: string;
//   product_id: string;
//   product: Product;
//   quantity: number;
//   price: number;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
//   contact: string;
//   address: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// types/index.ts

// Ini adalah interface 'Order' yang akan digunakan di frontend lokal Anda
// Diselaraskan dengan definisi dari api.ts, tapi dengan penyesuaian untuk data lokal


// Interface Product yang digunakan di frontend (mungkin berbeda sedikit dari API)
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string; // Nama kategori
  category_id: string;
  price: number;
  cost_price: number;
  stock: number;
  minOrder: number;
  isActive: boolean;
  branch_id: string;
  thumbnail_id: string;
  paperType: string | null;
  paperGrammar: string | null;
  printType: 'Black & White' | 'Full Color' | null;
  finishingType: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya' | null;
  customFinishing: string | null;
  created_at: string;
  updated_at: string;
}

// Gunakan definisi Task langsung dari api.ts
// export type Task = Task;

// Ini mungkin perlu disesuaikan dengan interface OrderItem dari api.ts
// Jika OrderItem lokal Anda adalah sama persis, Anda bisa langsung menggunakannya.
// export interface OrderItemLocal extends OrderItem {
  // Jika ada properti tambahan di sisi lokal, tambahkan di sini
  // Misalnya, jika 'product' di OrderItem api.ts tidak memiliki semua detail yang Anda butuhkan secara lokal
  // Maka, Anda bisa override atau tambahkan properti di sini.
  // Tapi berdasarkan api.ts, OrderItem sudah memiliki product: Product.
// }

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

export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
