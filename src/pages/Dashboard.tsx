import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import type { DashboardStats } from '../types';
import StatCard from '../components/StatCard';
import {
  Users,
  Store,
  ShoppingCart,
  MessageSquare,
  UtensilsCrossed,
  CreditCard,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-4">
          <p className="text-3xl">⚠️</p>
        </div>
        <p className="text-gray-700 font-semibold text-lg">Unable to load dashboard statistics</p>
        <p className="text-gray-500 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 -mr-48 -mt-48"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Overview of your platform statistics and performance</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="from-blue-500 to-blue-600"
          change="+12%"
          changeType="increase"
        />
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors.toLocaleString()}
          icon={Store}
          color="from-purple-500 to-purple-600"
          change="+8%"
          changeType="increase"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="from-green-500 to-green-600"
          change="+23%"
          changeType="increase"
        />
        <StatCard
          title="Total Bids"
          value={stats.totalBids.toLocaleString()}
          icon={MessageSquare}
          color="from-orange-500 to-orange-600"
          change="+15%"
          changeType="increase"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Menu Items"
          value={stats.totalMenuItems.toLocaleString()}
          icon={UtensilsCrossed}
          color="from-pink-500 to-pink-600"
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments.toLocaleString()}
          icon={CreditCard}
          color="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-emerald-500 to-emerald-600"
          change="+18%"
          changeType="increase"
        />
        <StatCard
          title="Active Vendors"
          value={stats.activeVendors.toLocaleString()}
          icon={TrendingUp}
          color="from-cyan-500 to-cyan-600"
        />
      </div>

      {/* Detailed Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Order Status</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold">Pending Orders</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  {stats.pendingOrders.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full" style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}></div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold">Completed Orders</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {stats.completedOrders.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" style={{ width: `${(stats.completedOrders / stats.totalOrders) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold">Completion Rate</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stats.totalOrders > 0
                    ? `${((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" style={{ width: `${stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100) : 0}%` }}></div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold">Avg Revenue/Order</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${stats.totalOrders > 0
                    ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                    : '0.00'}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
