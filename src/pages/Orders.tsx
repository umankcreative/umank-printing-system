import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Loader2, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import OrderForm from '../components/OrderForm';
import {OrderActions} from '../components/OrderActions';
import { Order } from '../types/api';
import { useOrderContext } from '../context/OrderContext';
import { formatCurrency } from '../lib/utils';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
// import { v4 as uuidv4 } from 'uuid';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { 
    orders, 
    loading, 
    error, 
    addOrder,
    updateOrder, 
    deleteOrder,
    currentPage, 
    totalPages, 
    fetchOrders,
    getOrder
  } = useOrderContext();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch orders when debounced search term changes
  useEffect(() => {
    fetchOrders({ search: debouncedSearchTerm || undefined });
  }, [debouncedSearchTerm, fetchOrders]);

  

  const handleSubmit = async (order: Order) => {
    try {
      if (isEditing && selectedOrder) {
        await updateOrder(order);
        toast.success('Order berhasil diperbarui');
      } else {
        await addOrder(order);
        toast.success('Order berhasil dibuat');
      }
      handleCloseForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menyimpan order';
      toast.error(message);
    }
  };

  const handleCloseForm = () => {
    setShowOrderForm(false);
    setSelectedOrder(null);
    setIsEditing(false);
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    fetchOrders({ page: newPage, search: debouncedSearchTerm || undefined });
  }, [fetchOrders, debouncedSearchTerm]);

  const handleEdit = async (order: Order) => {
    try {
      const fullOrder = await getOrder(order.id);
      if (fullOrder) {
        setSelectedOrder(fullOrder);
        setIsEditing(true);
        setShowOrderForm(true);
      } else {
        toast.error('Failed to fetch order details');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch order details';
      toast.error(message);
    }
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;

    try {
      await deleteOrder(selectedOrder.id);
      setShowDeleteConfirm(false);
      setSelectedOrder(null);
      toast.success('Order berhasil dihapus');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete order';
      toast.error(message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={() => fetchOrders()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />Orders</h1>
        <Button 
          onClick={() => {
            setIsEditing(false);
            setSelectedOrder(null);
            setShowOrderForm(true);
          }} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  console.log('Order data:', {
                    id: order.id,
                    customer: order.customer
                  });
                  
                  return (
                    
                    <tr key={order.id}  className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-purple-600 hover:text-purple-800"
                    >
                          #{order.id.slice(0, 8)}
                      </Link>
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {order.customer?.name || 'N/A'}
                          </span>
                          {order.customer?.company && (
                            <span className="text-xs text-gray-500">
                              {order.customer.company}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {order.customer?.phone || 'N/A'}
                          </span>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {order.branch?.name || 'N/A'}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.delivery_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status.charAt(0).toUpperCase() +
                            order.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-gray-600">
                          {order.items?.length || 0} items
                      
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(order)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:-translate-x-1 hover:scale-150"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(order)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 hover:-translate-x-1 hover:scale-150"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
  variant="ghost"
  size="icon"
  onClick={() => navigate(`/admin/orders/${order.id}/invoice`)}
  className="h-8 w-8 text-gray-600 hover:text-gray-700"
>
  <FileText className="h-4 w-4" />
                          </Button> */}
                          
                          <OrderActions
                              orderId={order.id}
                              onEdit={() => handleEdit(order)}
                              onDelete={() => handleDelete(order)}
                              onDuplicate={() => handleAddForm(order)}
                              onPrint={() => navigate(`/admin/orders/${order.id}/invoice`)}
                              onShareForm={() => onShareForm(order)}
                          />
                        </div>
                      </td>
                      </tr>
                      
                  );
                })
                
              )
              }
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {showOrderForm && (
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          initialOrder={selectedOrder || undefined}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Order</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus order #{selectedOrder?.id.slice(0, 8)}? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;