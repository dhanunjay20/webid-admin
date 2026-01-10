import React, { useEffect, useState } from 'react';
import { userApi } from '../services/api';
import type { User } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Eye, Search } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };



  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const columns = [
    {
      key: 'firstName',
      header: 'Name',
      render: (user: User) => `${user.firstName} ${user.lastName}`,
    },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Phone' },
    {
      key: 'addresses',
      header: 'Addresses',
      render: (user: User) => user.addresses?.length || 0,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(user);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">View</span>
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-green-100 mt-1">Manage all registered users</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm text-green-100 font-medium">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      <DataTable data={filteredUsers} columns={columns} emptyMessage="No users found" />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="text-gray-900">{selectedUser.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="text-gray-900">{selectedUser.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{selectedUser.mobile}</p>
              </div>
            </div>

            {selectedUser.addresses && selectedUser.addresses.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Addresses</label>
                {selectedUser.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg mb-2">
                    <p className="text-sm text-gray-900">
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedUser.stripeCustomerId && (
              <div>
                <label className="text-sm font-medium text-gray-600">Stripe Customer ID</label>
                <p className="text-gray-900 font-mono text-sm">{selectedUser.stripeCustomerId}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
