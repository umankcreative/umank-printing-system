import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card1";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import  Badge  from "../components/ui/badge";
import { Plus, Search, Filter, TrendingUp, TrendingDown, DollarSign, Settings } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../lib/utils";
// import Header from "@/components/Header";
import TransactionDialog from "../components/finance/TransactionDialog";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";
import transactionServices from '../services/transactionServices';
import { Finance as Transaction, Category } from '../types/api';
import api from '../lib/axios';

// const API_BASE_URL = "https://373b-114-10-139-244.ngrok-free.app/api";

 

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [financeCategory, setFinanceCategories] =  useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const { toast } = useToast();

  // useEffect(() => {
  //     const fetchCategories = async () => {
  //       try {
  //         const productCategories = await transactionServices.getCategories();
  //         // Filter for product type categories only
  //         // const productCategories = data.filter(cat => cat.type === 'product');
  //         setFinanceCategories(productCategories);
  //       } catch (error) {
  //         console.error('Error fetching categories:', error);
  //       // } finally {
  //       //   setLoading(false);
  //       }
  //     };
  
  //     fetchCategories();
  // }, []);

  const { data: transactions = [] } = useQuery({
  queryKey: ['finances'], // Changed queryKey to 'finances'
  queryFn: async () => {
    const response = await transactionServices.getFinances(); // Using the new financeService
    console.log('Fetched finances:', response); // The data directly from getFinances
    console.log('Finances is array:', Array.isArray(response));
    return response;
  },
  retry: false
});

  const { data: categories = financeCategory } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await transactionServices.getCategories();
      setFinanceCategories(response);
      console.log('Fetched categories:', response);
      console.log('Categories is array:', Array.isArray(response));
      return response;
    },
    retry: false
  });

  // Ensure data is always an array
  // const safeTransactions = Array.isArray(transactions) ? transactions : [];
  // const safeCategories = Array.isArray(categories) ? categories : [];
  
  console.log('Safe transactions:', transactions, 'Type:', typeof transactions);
  console.log('Safe categories:', categories, 'Type:', typeof categories);

  // Calculate totals using safe arrays
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Prepare chart data using safe arrays
  const expenseByCategory = categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.category === cat.key)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        name: cat.label,
        value: total,
        color: cat.color
      };
    })
    .filter(item => item.value > 0);

  const incomeByCategory = categories
    .filter(cat => cat.type === 'income')
    .map(cat => {
      const total = transactions
        .filter(t => t.type === 'income' && t.category === cat.key)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        name: cat.label,
        value: total,
        color: cat.color
      };
    })
    .filter(item => item.value > 0);

  // Monthly data for bar chart using safe arrays
  const monthlyData = transactions.reduce((acc: any, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].income += Number(transaction.amount);
    } else {
      acc[monthKey].expense += Number(transaction.amount);
    }
    
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).slice(-6);

  // Filter transactions using safe arrays
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getCategoryInfo = (categoryKey: string) => {
    return categories.find(cat => cat.key === categoryKey);
  };

  const handleTransactionAdded = () => {
    toast({
      title: "Transaksi berhasil ditambahkan",
      description: "Transaksi baru telah disimpan ke database.",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pencatat Keuangan</h1>
          <div className="flex gap-2">
            <Link to="/admin/category-management">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Kelola Kategori
              </Button>
            </Link>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpense)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={incomeByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {incomeByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tren Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="income" fill="#10b981" />
                  <Bar dataKey="expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl">Transaksi</CardTitle>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari transaksi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 w-48 border border-input rounded-md bg-background"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 w-64 border border-input rounded-md bg-background"
                >
                  <option value="all">Semua Kategori</option>
                  {categories
                  .filter((category) => category.type === selectedType)
                  .map((category) => (
                    <option key={category.id} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const categoryInfo = getCategoryInfo(transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: categoryInfo?.color || '#6b7280' }}
                      >
                        {categoryInfo?.icon || '💰'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge variant={categoryInfo?.type === 'income' ? 'default' : 'destructive'}>
                        {categoryInfo?.label || transaction.category}
                      </Badge>
                      <div className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada transaksi yang ditemukan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTransactionAdded={handleTransactionAdded}
        categories={categories}
        // apiBaseUrl={API_BASE_URL}
      />
    </div>
  );
};

export default Finance;


