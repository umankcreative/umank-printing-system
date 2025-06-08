import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Customer } from '../types/api';
import customerService, { CreateCustomerPayload } from '../services/customerService';
import { toast } from 'sonner';
import { isValidUUID } from '../lib/utils';

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  addCustomer: (customer: CreateCustomerPayload) => Promise<Customer>;
  updateCustomer: (id: string, customer: Partial<CreateCustomerPayload>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomer: (id: string) => Promise<Customer | undefined>;
  refreshCustomers: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getCustomers();
      setCustomers(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch customers';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  const addCustomer = useCallback(async (customerData: CreateCustomerPayload): Promise<Customer> => {
    try {
      const newCustomer = await customerService.createCustomer(customerData);
      
      // Validate the server response
      if (!newCustomer.id || !isValidUUID(newCustomer.id)) {
        throw new Error('Server returned invalid customer ID format');
      }
      
      setCustomers(prev => [...prev, newCustomer]);
      // toast.success('Customer added successfully');
      return newCustomer;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add customer';
      toast.error(message);
      throw err;
    }
  }, []);

  const updateCustomer = async (id: string, customerData: Partial<CreateCustomerPayload>) => {
    try {
      const updatedCustomer = await customerService.updateCustomer(id, customerData);
      setCustomers(prev =>
        prev.map(customer => customer.id === id ? updatedCustomer : customer)
      );
      // toast.success('Customer updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update customer';
      toast.error(message);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customerService.deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      // toast.success('Customer deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete customer';
      toast.error(message);
      throw err;
    }
  };

  const getCustomer = async (id: string): Promise<Customer | undefined> => {
    try {
      return await customerService.getCustomer(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch customer';
      toast.error(message);
      throw err;
    }
  };

  const value = {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    refreshCustomers,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
};