/*
  # Initial Schema Setup

  1. New Tables
    - users (authentication and admin users)
    - branches (store locations/branches)
    - ingredients (raw materials and supplies)
    - products (finished goods)
    - product_images (product photos)
    - product_ingredients (recipe/formula)
    - customers (client information)
    - orders (sales transactions)
    - order_items (order details)
    - tasks (todo items)
    - task_comments (task discussions)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read branches"
  ON branches
  FOR SELECT
  TO authenticated
  USING (true);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  unit text NOT NULL,
  price_per_unit numeric NOT NULL DEFAULT 0,
  stock numeric NOT NULL DEFAULT 0,
  branch_id uuid REFERENCES branches(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on ingredients"
  ON ingredients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cost_price numeric NOT NULL DEFAULT 0,
  selling_price numeric NOT NULL DEFAULT 0,
  min_order numeric NOT NULL DEFAULT 1,
  stock numeric NOT NULL DEFAULT 0,
  branch_id uuid REFERENCES branches(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on product_images"
  ON product_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create product_ingredients table (recipe/formula)
CREATE TABLE IF NOT EXISTS product_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on product_ingredients"
  ON product_ingredients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  order_date timestamptz DEFAULT now(),
  delivery_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity numeric NOT NULL DEFAULT 0,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on order_items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  deadline timestamptz,
  priority text DEFAULT 'medium',
  assignee_id uuid REFERENCES auth.users(id),
  ingredient_id uuid REFERENCES ingredients(id),
  order_id uuid REFERENCES orders(id),
  parent_task_id uuid REFERENCES tasks(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create task_comments table
CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions on task_comments"
  ON task_comments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default branch
INSERT INTO branches (id, name, address, contact)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Main Branch',
  'Main Street 123',
  '+1234567890'
) ON CONFLICT DO NOTHING;