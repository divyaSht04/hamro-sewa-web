import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, DollarSign, Star } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-700 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Services Offered', value: '56', icon: Briefcase, color: 'bg-green-500' },
    { title: 'Revenue', value: '$12,345', icon: DollarSign, color: 'bg-yellow-500' },
    { title: 'Avg. Rating', value: '4.8', icon: Star, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/admin/services" className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Manage Services
            </Link>
            <Link to="/admin/users" className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Manage Users
            </Link>
            <Link to="/admin/profile" className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

