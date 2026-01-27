import React, { useEffect, useState } from 'react';
import { userApi } from '../services/api';
import type { User } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Eye, Search, Ban, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [statusReason, setStatusReason] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => { // Load users with role=USER
    try {
      setLoading(true);
      // Force role=USER for now
      const response = await userApi.getAllUsers({ role: 'USER' });

      // Handle both direct array and paginated response
      if (Array.isArray(response)) {
        setUsers(response);
        setTotalUsers(response.length);
      } else {
        setUsers(response.data || response);
        setTotalUsers(Array.isArray(response.data) ? response.data.length : response.total || 0);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleStatusChange = (user: User) => {
    setSelectedUser(user);
    setNewStatus(user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser) return;

    try {
      await userApi.updateUserStatus(selectedUser.id, {
        status: newStatus,
        reason: statusReason,
      });
      setShowStatusModal(false);
      setStatusReason('');
      loadUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      !searchQuery ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(totalUsers / pageSize);

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (user: User) => (
        <div>
          <p className="font-semibold text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ),
    },
    { 
      key: 'mobile', 
      header: 'Phone',
      render: (user: User) => user.mobile || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : user.status === 'SUSPENDED'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {user.status || 'ACTIVE'}
        </span>
      ),
    },
    {
      key: 'userType',
      header: 'Type',
      render: (user: User) => (
        <span className="text-sm text-gray-600">{user.userType || 'USER'}</span>
      ),
    },
    {
      key: 'addresses',
      header: 'Addresses',
      render: (user: User) => (
        <span className="text-sm text-gray-600">{user.addresses?.length || 0}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(user);
            }}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(user);
            }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              user.status === 'ACTIVE'
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            title={user.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
          >
            {user.status === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  if (loading && users.length === 0) {
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
            <p className="text-green-100 mt-1">Manage all registered users - Total: {totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Page Size */}
          <div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <DataTable data={filteredUsers} columns={columns} />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalUsers)} of {totalUsers} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <p className="mt-1 text-gray-900">{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Phone</label>
              <p className="mt-1 text-gray-900">{selectedUser.mobile || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <p className="mt-1 text-gray-900">{selectedUser.status || 'ACTIVE'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Addresses</label>
              <div className="mt-2 space-y-2">
                {selectedUser.addresses?.map((addr, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                    </p>
                  </div>
                ))}
                {(!selectedUser.addresses || selectedUser.addresses.length === 0) && (
                  <p className="text-sm text-gray-500">No addresses added</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusReason('');
        }}
        title={`${newStatus === 'ACTIVE' ? 'Activate' : 'Suspend'} User`}
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to {newStatus === 'ACTIVE' ? 'activate' : 'suspend'}{' '}
              <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?
            </p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason {newStatus === 'SUSPENDED' && '(Required)'}
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Enter reason for status change..."
                required={newStatus === 'SUSPENDED'}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmStatusChange}
                disabled={newStatus === 'SUSPENDED' && !statusReason.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
