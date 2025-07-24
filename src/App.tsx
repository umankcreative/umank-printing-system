import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import GuestLayout from './layout/GuestLayout';
import AdminLayout from './layout/AdminLayout';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { TaskProvider } from './context/TaskContext';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { FormProvider } from './context/FormContext';
import { CustomerProvider } from './context/CustomerContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/toaster'; // Shadcn Toaster
import { Toaster as Sonner } from './components/ui/sonner'; // Sonner Toaster
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Pages - Admin
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import ProductDetail from './pages/ProductDetail';
import IngredientList from './pages/IngredientList';
import TodoBoard from './pages/TodoBoard';
import TaskDetailPage from './pages/TaskDetailPage';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Invoice from './pages/Invoice';
import Customers from './pages/Customers';
import Users from './pages/UsersPage';
import { Settings } from './pages/Settings';
import Print from './pages/Print';
import FormBuilder from './pages/FormBuilder';
import FormManagement from './pages/FormManagement';
import FormSubmissionList from './pages/FormSubmisssionList';
import FormSubmissionDetail from './pages/FormSubmissionDetail';
import OrderItemForms from './pages/OrderItemForms';
import Finance from './pages/Finance';
import CategoryManagement from './pages/CategoryManagement';

// Pages - Guest/Public
import Guest from './pages/Guest';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicTaskPage from './pages/PublicTaskPage';
import { NotFoundPage } from './pages/NotFoundPage';

import './App.css'; // Pastikan CSS diimpor

const queryClient = new QueryClient();

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* AuthProvider membungkus seluruh aplikasi karena otentikasi bersifat global */}
      <AuthProvider>
        {/* Toaster & Sonner di level teratas untuk ketersediaan global */}
        <Toaster />
        <Sonner />

        {/* QueryClientProvider di level teratas karena banyak komponen menggunakannya */}
        <QueryClientProvider client={queryClient}>
          {/* TooltipProvider di level teratas untuk ketersediaan global */}
          <TooltipProvider>
            {/* ErrorBoundary di sini untuk menangkap error di seluruh rute */}
            <ErrorBoundary>
              <Routes>
                {/* --- Rute Admin (Memerlukan Proteksi) --- */}
                <Route
                  path="/admin/*" // Menggunakan /* untuk rute bersarang
                  element={
                    <ProtectedRoute>
                      {/* DndProvider hanya untuk bagian admin yang memerlukannya */}
                      <DndProvider backend={HTML5Backend}>
                        {/* Provider yang umum digunakan di AdminLayout */}
                        <ProductProvider>
                          <UserProvider>
                            <OrderProvider>
                              <CustomerProvider>
                                <TaskProvider>
                                  <FormProvider>
                                    <AdminLayout /> {/* AdminLayout menjadi wadah untuk rute bersarang */}
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
                  {/* Rute anak untuk AdminLayout */}
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
                  <Route path="orders/:id/invoice" element={<Invoice />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="users" element={<Users />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="print" element={<Print />} />
                  <Route path="form-builder/new" element={<FormBuilder />} />
                  <Route path="form-builder/:id" element={<FormBuilder />} />
                  <Route path="form-management" element={<FormManagement />} />
                  <Route path="form-submissions" element={<FormSubmissionList />} />
                  <Route path="form-submissions/:id" element={<FormSubmissionDetail />} />
                  <Route path="orders/:orderId/item-forms" element={<OrderItemForms />} />
                  <Route path="finance" element={<Finance />} />
                  <Route path="category-management" element={<CategoryManagement />} />
                </Route>

                {/* --- Rute Publik/Guest --- */}
                <Route
                  path="/"
                  element={
                    <GuestLayout /> // GuestLayout menjadi wadah untuk rute bersarang publik
                  }
                >
                  <Route index element={<Guest />} />
                  <Route path="share/:shareId" element={<PublicTaskPage />} />
                  <Route path="shop" element={
                    // Providers khusus untuk Shop jika Shop tidak memerlukan semua AdminLayout providers
                    <ProductProvider>
                      <FormProvider>
                        <CartProvider>
                          <Shop />
                        </CartProvider>
                      </FormProvider>
                    </ProductProvider>
                  } />
                  <Route path="cart" element={
                    // Providers khusus untuk Cart
                    <ProductProvider>
                      <FormProvider>
                        <CartProvider>
                          <OrderProvider>
                            <Cart />
                          </OrderProvider>
                        </CartProvider>
                      </FormProvider>
                    </ProductProvider>
                  } />
                  <Route path="form/:orderId" element={
                    // Providers khusus untuk OrderItemForms
                    <ProductProvider>
                      <FormProvider>
                        <CartProvider>
                          <OrderProvider>
                            <OrderItemForms />
                          </OrderProvider>
                        </CartProvider>
                      </FormProvider>
                    </ProductProvider>
                  } />
                  <Route path='login' element={<Login />} />
                  <Route path='register' element={<Register />} />
                  {/* Rute logout mungkin perlu penanganan khusus (misal, mengarahkan ke fungsi logout) */}
                  <Route path="logout" element={<Login />} /> 
                </Route>

                {/* --- Catch-all route untuk 404 --- */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;