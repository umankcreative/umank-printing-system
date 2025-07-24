import api from '../lib/axios'; 
import { Finance, Transaction, Category } from '../types/api';


const transactionServices = {
  /**
   * Fetches all transactions from the API.
   * @returns {Promise<Transaction[]>} A promise that resolves to an array of transactions.
   */
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get<Transaction[]>('/transactions');
      console.log('Fetched transactions:', response.data);
      console.log('Transactions is array:', Array.isArray(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
  
  async getFinances(): Promise<Finance[]> {
    const response = await api.get('/transactions');
    return response.data.data || [];
  },
  /**
   * Adds a new transaction to the API.
   * @param {Omit<Transaction, 'id'>} transactionData - The data for the new transaction, excluding the ID.
   * @returns {Promise<Transaction>} A promise that resolves to the newly created transaction.
   */
  addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
      const response = await api.post<Transaction>('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  /**
   * Fetches all categories from the API.
   * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>('/finance-categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};

export default transactionServices;
