import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { bidApi } from '../services/api';
import type { Bid } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';
import { Eye, Search, Filter } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'] as const;

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  WITHDRAWN: 'bg-gray-200 text-gray-800',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const Bids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  useEffect(() => {
    const loadBids = async () => {
      try {
        const data = await bidApi.getAllBids();
        setBids(data);
      } catch (err) {
        console.error('Failed to load bids', err);
      } finally {
        setLoading(false);
      }
    };

    loadBids();
  }, []);

  const filteredBids = useMemo(() => {
    return bids.filter((bid) => {
      const matchesSearch =
        bid.vendorBusinessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.eventName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || bid.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bids, searchQuery, statusFilter]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Delete this bid permanently?')) return;

    try {
      await bidApi.deleteBid(id);
      setBids((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  }, []);

  const columns = useMemo(
    () => [
      { key: 'vendorBusinessName', header: 'Vendor' },
      { key: 'eventName', header: 'Event' },
      {
        key: 'proposedTotalPrice',
        header: 'Price',
        render: (bid: Bid) => formatCurrency(bid.proposedTotalPrice),
      },
      {
        key: 'status',
        header: 'Status',
        render: (bid: Bid) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusStyles[bid.status] ?? 'bg-gray-100'
            }`}
          >
            {bid.status}
          </span>
        ),
      },
      {
        key: 'submittedAt',
        header: 'Submitted',
        render: (bid: Bid) => new Date(bid.submittedAt).toLocaleDateString(),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (bid: Bid) => (
          <button
            onClick={() => setSelectedBid(bid)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </button>
        ),
      },
    ],
    [handleDelete]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bids Management</h1>
            <p className="text-pink-100 mt-1">Monitor and manage all vendor bids</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm text-pink-100 font-medium">Total Bids</p>
            <p className="text-3xl font-bold">{bids.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor or event..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white transition-all duration-200"
            />
          </div>

          <div className="sm:w-48">
            <Dropdown
              options={STATUS_OPTIONS.map((status) => ({
                value: status,
                label: status === 'ALL' ? 'All Status' : status,
                icon: <Filter className="w-4 h-4" />,
              }))}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredBids}
        columns={columns}
        emptyMessage="No bids match your filters"
      />

      {/* Modal */}
      <Modal
        isOpen={!!selectedBid}
        onClose={() => setSelectedBid(null)}
        title="Bid Details"
        size="lg"
      >
        {selectedBid && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Vendor" value={selectedBid.vendorBusinessName} />
              <Detail
                label="Status"
                value={
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[selectedBid.status]
                    }`}
                  >
                    {selectedBid.status}
                  </span>
                }
              />
              <Detail label="Event" value={selectedBid.eventName} />
              <Detail label="Price" value={formatCurrency(selectedBid.proposedTotalPrice)} />
              <Detail label="Submitted" value={new Date(selectedBid.submittedAt).toLocaleString()} />
              <Detail label="Updated" value={new Date(selectedBid.updatedAt).toLocaleString()} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Message</p>
              <div className="max-h-40 overflow-y-auto rounded-lg bg-gray-50 p-4 text-gray-900">
                {selectedBid.proposedMessage || '—'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <div className="mt-1 text-gray-900 font-medium">{value}</div>
  </div>
);

export default Bids;
