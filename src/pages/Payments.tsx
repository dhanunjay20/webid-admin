import React, { useEffect, useState } from 'react';
import { paymentApi } from '../services/api';
import type { Payment } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Eye, Search } from 'lucide-react';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (searchQuery) {
      filtered = filtered.filter(
        (payment) =>
          payment.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.stripePaymentIntentId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  }, [searchQuery, statusFilter, payments]);

  const loadPayments = async () => {
    try {
      const data = await paymentApi.getAllPayments();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      SUCCEEDED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { key: 'customerName', header: 'Customer' },
    { key: 'vendorName', header: 'Vendor' },
    {
      key: 'amountInCents',
      header: 'Amount',
      render: (payment: Payment) => `$${(payment.amountInCents / 100).toFixed(2)}`,
    },
    { key: 'currency', header: 'Currency' },
    {
      key: 'status',
      header: 'Status',
      render: (payment: Payment) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
          {payment.status}
        </span>
      ),
    },
    {
      key: 'paidAt',
      header: 'Paid At',
      render: (payment: Payment) =>
        payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (payment: Payment) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(payment);
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

  const totalRevenue = payments
    .filter((p) => p.status === 'SUCCEEDED')
    .reduce((sum, p) => sum + p.amountInCents, 0) / 100;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments Management</h1>
            <p className="text-emerald-100 mt-1">Track all payment transactions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm text-emerald-100 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
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
              placeholder="Search payments by customer, vendor, or payment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-700 transition-all duration-200"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      <DataTable data={filteredPayments} columns={columns} emptyMessage="No payments found" />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Payment Details"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Customer</label>
                <p className="text-gray-900 font-semibold">{selectedPayment.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Vendor</label>
                <p className="text-gray-900">{selectedPayment.vendorName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Amount</label>
                <p className="text-gray-900 font-semibold text-lg">
                  ${(selectedPayment.amountInCents / 100).toFixed(2)} {selectedPayment.currency.toUpperCase()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Paid At</label>
                <p className="text-gray-900">
                  {selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created At</label>
                <p className="text-gray-900">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Stripe Information</h4>
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium text-gray-600">Payment Intent ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedPayment.stripePaymentIntentId}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium text-gray-600">Customer ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedPayment.stripeCustomerId}</p>
                </div>
                {selectedPayment.stripeChargeId && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-600">Charge ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedPayment.stripeChargeId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
