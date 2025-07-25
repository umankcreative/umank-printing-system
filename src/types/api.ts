import { UserRole, UserStatus } from './user';

export interface Branch {
  id: string;
  name: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskTemplate {
  id: string;
  ingredient_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
  created_at: string;
  updated_at: string;
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



export interface ProductImage {
  id: string;
  product_id: string;
  url: string | null;
  is_primary: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  price_per_unit: string;
  notes: string | null;
  task_templates: TaskTemplate[];
}

export interface RecipeIngredientRequest {
  ingredient_id: string;
  quantity: string;
  notes: string | null;
}

export interface Product {
  id: string;
  name: string;
    description?: string;
    thumbnail_id: string;
  category_id: string;
  cost_price: string;
  price: string;
  min_order: number;
  stock: number;
  branch_id: string;
  is_active: boolean;
  paper_type: string | null;
  paper_grammar: string | null;
  print_type: 'Black & White' | 'Full Color' | null;
  finishing_type: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya' | null;
  custom_finishing: string | null;
  is_paper_enabled: boolean;
  is_printing_enabled: boolean;
  is_finishing_enabled: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  thumbnail?: ProductImage;
  additional_images?: ProductImage[];
  ingredients?: RecipeIngredient[];
  customer(customer: Customer[]): unknown;
  items(items: OrderItem[]): unknown;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  branch_id: string;
  avatar: string | null;
  last_active: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  branch: Branch;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
  links: {
    next: string | null;
    prev: string | null;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product;
  quantity: number;
  price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  contact: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  order_id: string;
  title: string;
  description: string;
  status: 'pending' | 'todo' | 'in-progress' | 'review' | 'completed' | 'closed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  deadline: string;
  parent_task_id?: string;
  created_at: string;
  updated_at: string;
  subtasks?: Task[];
}

export interface Order {
  id: string;
  customer_id: string;
  customer: Customer;
  branch_id: string;
  branch?: {
    id: string;
    name: string;
    location: string;
    is_active: boolean | number;
    created_at: string;
    updated_at: string;
  };
  total_amount: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid';
  payment_method: 'cash' | 'transfer' | 'debit' | 'credit';
  notes: string | null;
  order_date: string;
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  tasks?: Task[];
} 

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PrintJobStatus = 'pending' | 'printing' | 'completed' | 'failed';

export interface PrintJob {
  id: string;
  name: string;
  fileUrl?: string;
  fileName: string;
  createdAt: Date;
  status: PrintJobStatus;
  pages: number;
  copies: number;
  color: boolean;
  doubleSided: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrintSettings {
  defaultPrinter: string;
  defaultColor: boolean;
  defaultDoubleSided: boolean;
  defaultCopies: number;
}


export interface Transaction {
  amount: number;
  category: string;
  created_at: string;
  date: string;
  description: string;
  id: string;
  type: string;
  updated_at: string;
}


export interface Category {
  id: string;
  key: string;
  label: string;
  icon: string;
  type: string; // 'income' | 'expense'
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinanceCategoryDetails {
  id: string;
  key: string;
  label: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Finance {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  category: string;
  finance_category_details: FinanceCategoryDetails;
  created_at: string;
  updated_at: string;
}