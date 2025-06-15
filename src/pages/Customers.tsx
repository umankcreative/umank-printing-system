import React, { useState, useMemo, useEffect } from 'react';
import { useOrderContext } from '../context/OrderContext';
import { useCustomerContext } from '../context/CustomerContext';
import { Order } from '../types';
import { Customer } from '../types/api';
import { Search, Users, Mail, Phone, Building2, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  contact: string;
  address: string;
  is_active: boolean;
}

const initialFormData: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  contact: '',
  address: '',
  is_active: true
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Customers = () => {
  const { orders } = useOrderContext();
  const { 
    customers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    refreshCustomers,
    loading 
  } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    return customers.filter(customer => {
      if (!customer) return false;
      
      const searchFields = [
        customer.name,
        customer.email,
        customer.phone,
        customer.company,
        customer.contact,
        customer.address
      ];
      
      return searchFields.some(field => 
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [customers, searchTerm]);

  // Get customer orders
  const getCustomerOrders = (customerId: string): Order[] => {
    return orders.filter(order => order.customer_id === customerId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedCustomer(null);
    setIsEditing(false);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Mohon isi field yang wajib diisi');
      return;
    }

    try {
      if (isEditing && selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
      } else {
        await addCustomer(formData);
      }
      
      // Force refresh customers data
      await refreshCustomers();
      
      // Reset form and close dialog
      resetForm();
      setShowAddForm(false);
      
      // Show success message
      toast.success(isEditing ? 'Data pelanggan berhasil diperbarui' : 'Pelanggan baru berhasil ditambahkan');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      contact: customer.contact,
      address: customer.address,
      is_active: customer.is_active
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDelete = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    
    try {
      await deleteCustomer(selectedCustomer.id);
      await refreshCustomers(); // Refresh data after delete
      setShowDeleteConfirm(false);
      setSelectedCustomer(null);
      toast.success('Data pelanggan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Gagal menghapus data pelanggan');
    }
  };

  const customerOrders = selectedCustomer ? getCustomerOrders(selectedCustomer.id) : [];

  useEffect(() => {
    refreshCustomers();
  }, []); // Run once on mount

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Daftar Pelanggan
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <button onClick={() => setShowAddForm(true)} className="flex btn btn-sm btn-outline-primary items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Pelanggan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Total Pesanan</TableHead>
              <TableHead>Terdaftar</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Tidak ada pelanggan yang sesuai dengan pencarian' : 'Belum ada data pelanggan'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer, index) => {
                const customerOrders = getCustomerOrders(customer.id);
                return (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell 
                      className="font-medium"
                      onClick={() => handleRowClick(customer)}
                    >
                      {customer.name}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(customer)}>
                      {customer.company || '-'}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(customer)}>
                      {customer.email}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(customer)}>
                      {customer.phone}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(customer)}>
                      {customerOrders.length}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(customer)}>
                      {new Date(customer.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(customer);
                          }}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:-translate-x-1 hover:scale-150"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer);
                          }}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 hover:-translate-x-1 hover:scale-150"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Customer Dialog */}
      <Dialog 
        open={showAddForm} 
        onOpenChange={(open) => {
          if (!open) resetForm();
          setShowAddForm(open);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Perusahaan</Label>
                <Input
                  id="company"
                  name="company"
                  required={true}
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Nama perusahaan (isi Perorangan jika tidak ada)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telepon <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nomor telepon"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Kontak Alternatif</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Kontak alternatif (opsional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
              <Button type="submit">
                {isEditing ? 'Perbarui' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Pelanggan</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Informasi Pelanggan</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">Nama:</span> {selectedCustomer.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">Perusahaan:</span> {selectedCustomer.company || '-'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">Email:</span> {selectedCustomer.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">Telepon:</span> {selectedCustomer.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Kontak:</span> {selectedCustomer.contact || '-'}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Alamat:</span> {selectedCustomer.address}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Statistik</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Total Pesanan:</span> {customerOrders.length}</p>
                    <p><span className="text-gray-500">Terdaftar:</span> {new Date(selectedCustomer.created_at).toLocaleDateString('id-ID')}</p>
                    <p><span className="text-gray-500">Terakhir Update:</span> {new Date(selectedCustomer.updated_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Riwayat Pesanan</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {customerOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.order_date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Status: {order.status}</p>
                          <p className="text-sm text-gray-500">
                            Items: {order.items.length}
                          </p>
                        </div>
                      </div>

                      {/* {order.form_data && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="font-medium mb-2">Form Responses:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(order.form_data).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="text-gray-500">{key}:</span>{' '}
                                {String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pelanggan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pelanggan "{selectedCustomer?.name}"? 
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

export default Customers;