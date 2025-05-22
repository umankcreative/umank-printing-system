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
  ingredients?: RecipeIngredient[];
  images?: ProductImage[];
  paperType?: string;
  paperGrammar?: string;
  printType?: 'Black & White' | 'Full Color';
  finishingType?: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya';
  customFinishing?: string;
  productionCost?: number;
  created_at: string;
  updated_at: string;
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
