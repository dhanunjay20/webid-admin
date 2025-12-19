import React, { useEffect, useState } from 'react';
import { orderApi } from '../services/api';
import type { Order } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Eye, Search } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.vendorName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const loadOrders = async () => {
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { key: 'eventName', header: 'Event Name' },
    { key: 'customerName', header: 'Customer' },
    { key: 'vendorName', header: 'Vendor' },
    {
      key: 'eventDate',
      header: 'Event Date',
      render: (order: Order) =>
        new Date(order.eventDate).toLocaleDateString(),
    },
    {
      key: 'guestCount',
      header: 'Guests',
    },
    {
      key: 'totalPrice',
      header: 'Total',
      render: (order: Order) => `$${order.totalPrice.toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(order);
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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p className="text-orange-100 mt-1">Manage all customer orders</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm text-orange-100 font-medium">Total Orders</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by event name, customer, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all duration-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium text-gray-700 transition-all duration-200"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <DataTable data={filteredOrders} columns={columns} emptyMessage="No orders found" />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Event Name</label>
                <p className="text-lg text-gray-900 font-medium">{selectedOrder.eventName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Customer</label>
                <p className="text-lg text-gray-900">{selectedOrder.customerName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Vendor</label>
                <p className="text-lg text-gray-900">{selectedOrder.vendorName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Event Date</label>
                <p className="text-lg text-gray-900">{new Date(selectedOrder.eventDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Guest Count</label>
                <p className="text-lg text-gray-900">{selectedOrder.guestCount} Guests</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Event Location</label>
                <p className="text-lg text-gray-900">{selectedOrder.eventLocation}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Price</label>
                <p className="text-2xl text-blue-600 font-bold">${selectedOrder.totalPrice.toFixed(2)}</p>
              </div>
            </div>

            {selectedOrder.menuItems && selectedOrder.menuItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Menu Items</h3>
                <div className="space-y-3">
                  {selectedOrder.menuItems.map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-500 mt-2 italic bg-white px-3 py-1 rounded-lg inline-block">{item.specialInstructions}</p>
                        )}
                      </div>
                      <p className="text-xl font-bold text-blue-600">${(item.pricePerUnit * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
