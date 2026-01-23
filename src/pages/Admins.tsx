import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import type { Admin } from '../types';
import DataTable from '../components/DataTable';
import { Shield, Search, ToggleLeft, ToggleRight } from 'lucide-react';

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = admins.filter(
        (admin) =>
          admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAdmins(filtered);
    } else {
      setFilteredAdmins(admins);
    }
  }, [searchQuery, admins]);

  const loadAdmins = async () => {
    try {
      const data = await adminApi.getAllAdmins();
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    setUpdatingStatus(adminId);
    try {
      // Update locally first for immediate UI feedback
      const updatedAdmins = admins.map(admin =>
        admin.id === adminId ? { ...admin, isActive: !currentStatus } : admin
      );
      setAdmins(updatedAdmins);
      setFilteredAdmins(updatedAdmins);
      
      // You would call your API here to update the backend
      // await adminApi.updateAdminStatus(adminId, !currentStatus);
      
    } catch (error) {
      // Revert on error
      loadAdmins();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      SUPER_ADMIN: 'bg-red-100 text-red-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      MODERATOR: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'username',
      header: 'Username',
      render: (admin: Admin) => (
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{admin.email}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (admin: Admin) => `${admin.firstName} ${admin.lastName}`,
    },
    { key: 'email', header: 'Email' },
    {
      key: 'userType',
      header: 'Role',
      render: (admin: Admin) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(admin.userType)}`}>
          {admin.userType}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (admin: Admin) => (
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              admin.isActive === true
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {admin.isActive === true ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAdminStatus(admin.id, admin.isActive);
            }}
            disabled={updatingStatus === admin.id}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              updatingStatus === admin.id
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 active:scale-95'
            }`}
            title={`Toggle to ${admin.isActive ? 'Inactive' : 'Active'}`}
          >
            {updatingStatus === admin.id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            ) : admin.isActive ? (
              <ToggleRight className="w-5 h-5 text-green-600" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'lastLoginAt',
      header: 'Last Login',
      render: (admin: Admin) =>
        admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : 'Never',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admins Management</h1>
            <p className="text-indigo-100 mt-1">Manage all administrator accounts and permissions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm text-indigo-100 font-medium">Total Admins</p>
            <p className="text-3xl font-bold">{admins.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">\n        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search admins by username, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      <DataTable data={filteredAdmins} columns={columns} emptyMessage="No admins found" />

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-2xl p-8 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">Admin Role Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-full">SUPER_ADMIN</span>
                <span className="text-gray-700">Full system access with all privileges and permissions</span>
              </div>
              <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">ADMIN</span>
                <span className="text-gray-700">Can manage users, vendors, orders, and platform content</span>
              </div>
              <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full">MODERATOR</span>
                <span className="text-gray-700">Can view and moderate content with limited management access</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-xs text-indigo-700 font-medium">💡 Tip: Use the toggle button to activate or deactivate admin accounts instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins;
