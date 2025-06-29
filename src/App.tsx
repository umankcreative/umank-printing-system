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
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { TooltipProvider } from './components/ui/tooltip';
// src/App.tsx or your router configuration file
import { Settings } from './pages/Settings';
import Customers from './pages/Customers';
import Invoice from './pages/Invoice';
import ErrorBoundary from './components/ErrorBoundary';

// import ReceiptPage from "./pages/ReceiptPage";
// import TemplatePage from "./pages/TemplatePage";
// import IndexTemplate from "./pages/IndexTemplate";

import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';

import GuestLayout from './layout/GuestLayout';
import AdminLayout from './layout/AdminLayout';

import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { TaskProvider } from './context/TaskContext';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { FormProvider } from './context/FormContext';
import { CustomerProvider } from './context/CustomerContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import FormBuilder from './pages/FormBuilder';
import FormManagement from './pages/FormManagement';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PublicForm from './pages/PublicForm';
import PublicTaskPage from './pages/PublicTaskPage';
import './App.css';
import FormSubmissionList from './pages/FormSubmisssionList';
import FormSubmissionDetail from './pages/FormSubmissionDetail';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DndProvider backend={HTML5Backend}>
                <ProductProvider>
                  <UserProvider>
                    <OrderProvider>
                      <CustomerProvider>
                        <TaskProvider>
                          <FormProvider>
                            <TooltipProvider>
                              <AdminLayout/>
                            </TooltipProvider>
                          </FormProvider>
                        </TaskProvider>
                      </CustomerProvider>
                    </OrderProvider>
                  </UserProvider>
                  </ProductProvider>
                  </DndProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<ErrorBoundary><ProductCreate /></ErrorBoundary>} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="ingredients" element={<IngredientList />} />
            <Route path="tasks" element={<TodoBoard />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="orders/:id/invoice" element={<Invoice />} />
            <Route path="customers" element={<Customers />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="form-builder/new" element={<FormBuilder />} />
            <Route path="form-builder/:id" element={<FormBuilder />} />
            <Route path="form-management" element={<FormManagement />} />
            <Route path="form-submissions" element={<FormSubmissionList />} />
            <Route path="form-submissions/:id" element={<FormSubmissionDetail />} />
            
          </Route>

          <Route path="/" element={<GuestLayout />}>
            <Route index element={<Guest />} />
            <Route path="/share/:shareId" element={<PublicTaskPage />} />
            <Route
              path="shop"
              element={
                <ProductProvider>
                  <FormProvider>
                    <CartProvider>
                      <Shop />
                    </CartProvider>
                  </FormProvider>
                </ProductProvider>
              }
            />
            <Route
              path="cart"
              element={
                <ProductProvider>
                  <FormProvider>
                    <CartProvider>
                      <OrderProvider>
                        <Cart />
                      </OrderProvider>
                    </CartProvider>
                  </FormProvider>
                </ProductProvider>
              }
            />
            <Route path="form/:id" element={<PublicForm />} />
            <Route path='login' element={<Login />} />
            <Route path="logout" element={<Login />} />
            
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;