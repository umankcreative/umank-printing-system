import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import ProductDetail from './pages/ProductDetail';
import IngredientList from './pages/IngredientList';
import TodoBoard from './pages/TodoBoard';
import { NotFoundPage } from './pages/NotFoundPage';
import TaskDetailPage from './pages/TaskDetailPage';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Guest from './pages/Guest';
import Users from './pages/UsersPage';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import GuestLayout from './layout/GuestLayout';
import AdminLayout from './layout/AdminLayout';

import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { TaskProvider } from './context/TaskContext';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import './App.css';
import Login from './pages/Login';
import IngredientForm from './components/IngredientForm';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Toaster />
      <Sonner />
      <Routes>
        <Route
          path="/admin"
          element={
            <ProductProvider>
              <UserProvider>
                <OrderProvider>
                  <TaskProvider>
                    <AdminLayout />
                  </TaskProvider>
                </OrderProvider>
              </UserProvider>
            </ProductProvider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="ingredients" element={<IngredientList />} />
          <Route path="tasks" element={<TodoBoard />} />
          <Route path="tasks/:id" element={<TaskDetailPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="users" element={<Users />} />
        </Route>

        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Guest />} />
          <Route
            path="shop"
            element={
              <CartProvider>
                <Shop />
              </CartProvider>
            }
          />
          <Route
            path="cart"
            element={
              <CartProvider>
                <Cart />
              </CartProvider>
            }
          />

          <Route path='login' element={<Login />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;