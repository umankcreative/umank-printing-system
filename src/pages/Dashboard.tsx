import React from 'react';
import { Package, Box, ShoppingCart, ClipboardList } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';

const Dashboard: React.FC = () => {
  const { products, ingredients } = useProductContext();

  const stats = [
    {
      title: 'Total Produk',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Bahan',
      value: ingredients.length,
      icon: Box,
      color: 'bg-green-500',
    },
    {
      title: 'Total Pesanan',
      value: '0', // TODO: Implement order tracking
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Tugas',
      value: ingredients.reduce(
        (acc, ing) => acc + (ing.taskTemplates?.length ?? 0),
        0
      ),
      icon: ClipboardList,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md pl-6 pt-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between overflow-hidden">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-64 h-64 -mr-16 -mb-16 opacity-30 p-3 rounded-full ${stat.color} bg-opacity-10`}
              >
                <stat.icon
                  className={`w-64 h-64 ${stat.color.replace('bg-', 'text-')}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 