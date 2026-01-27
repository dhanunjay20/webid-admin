import React, { useEffect, useState } from 'react';
import { vendorApi } from '../services/api';
import type { Vendor } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Store, Eye, CheckCircle, XCircle} from 'lucide-react';

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [vendorToReject, setVendorToReject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  
  // Pagination state removed — API returns full lists now
  const [pageSize, setPageSize] = useState(25);

  // Filter state (no UI available to change it)
  const statusFilter = '';

  useEffect(() => {
    if (activeTab === 'all') {
      loadVendors();
    } else {
      loadPendingVendors();
    }
  }, [statusFilter, activeTab]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      // call simplified API (no pagination)
      const items: Vendor[] = await vendorApi.getAllVendors();

      // Optionally filter by status client-side if statusFilter is set
      const filtered = statusFilter ? items.filter(v => v.status === statusFilter) : items;

      setVendors(filtered);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingVendors = async () => {
    try {
      setLoading(true);
      // Backend requires an access code for this endpoint. Read from env or localStorage.
      const envAccessCode = import.meta.env.VITE_PENDING_ACCESS_CODE as string | undefined;
      const storedAccessCode = localStorage.getItem('vendorAccessCode') || undefined;
      const accessCode = envAccessCode || storedAccessCode;

      const items: Vendor[] = await vendorApi.getPendingVendors({ accessCode });
      setPendingVendors(items);
    } catch (error) {
      console.error('Failed to load pending vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId: string) => {
    if (!confirm('Are you sure you want to approve this vendor?')) return;

    try {
      await vendorApi.approveVendor(vendorId);
      alert('Vendor approved successfully!');
      if (activeTab === 'pending') {
        loadPendingVendors();
      } else {
        loadVendors();
      }
    } catch (error) {
      console.error('Failed to approve vendor:', error);
      alert('Failed to approve vendor');
    }
  };

  const handleRejectClick = (vendorId: string) => {
    setVendorToReject(vendorId);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!vendorToReject) return;
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await vendorApi.rejectVendor(vendorToReject, rejectReason);
      alert('Vendor rejected successfully!');
      setShowRejectModal(false);
      setRejectReason('');
      setVendorToReject(null);
      if (activeTab === 'pending') {
        loadPendingVendors();
      } else {
        loadVendors();
      }
    } catch (error) {
      console.error('Failed to reject vendor:', error);
      alert('Failed to reject vendor');
    }
  };

  const handleViewDetails = async (vendor: Vendor) => {
    try {
      setDetailLoading(true);
      // prefer backend vendorId when available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vendorIdFromRow = (vendor as any).vendorId || vendor.vendorOrganizationId || vendor.id;
      const full = await vendorApi.getVendorDetails(vendorIdFromRow);
      setSelectedVendor(full);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Failed to load vendor details:', error);
      alert('Failed to load vendor details');
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getApprovalBadge = (approvalStatus: string) => {
    const approvalColors: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return approvalColors[approvalStatus] || 'bg-gray-100 text-gray-800';
  };

  const allVendorsColumns = [
    {
      key: 'businessName',
      header: 'Business Name',
      render: (vendor: Vendor) => (
        <div>
          <p className="font-semibold text-gray-900">{vendor.businessName}</p>
          <p className="text-sm text-gray-500">{vendor.contactName}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (vendor: Vendor) => (
        <div>
          <p className="text-sm text-gray-900">{vendor.email}</p>
          <p className="text-sm text-gray-500">{vendor.mobile}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (vendor: Vendor) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(vendor.status || 'PENDING')}`}>
          {vendor.status || 'PENDING'}
        </span>
      ),
    },
    {
      key: 'approvalStatus',
      header: 'Approval',
      render: (vendor: Vendor) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalBadge(vendor.approvalStatus || 'PENDING')}`}>
          {vendor.approvalStatus || 'PENDING'}
        </span>
      ),
    },
    {
      key: 'isOnline',
      header: 'Online',
      render: (vendor: Vendor) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vendor.isOnline ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {vendor.isOnline ? 'Online' : 'Offline'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vendor: Vendor) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(vendor);
          }}
          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const pendingVendorsColumns = [
    {
      key: 'businessName',
      header: 'Business Name',
      render: (vendor: Vendor) => (
        <div>
          <p className="font-semibold text-gray-900">{vendor.businessName}</p>
          <p className="text-sm text-gray-500">{vendor.contactName}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (vendor: Vendor) => (
        <div>
          <p className="text-sm text-gray-900">{vendor.email}</p>
          <p className="text-sm text-gray-500">{vendor.mobile}</p>
        </div>
      ),
    },
    {
      key: 'approvalStatus',
      header: 'Approval Status',
      render: (vendor: Vendor) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalBadge(vendor.approvalStatus || 'PENDING')}`}>
          {vendor.approvalStatus || 'PENDING'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vendor: Vendor) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(vendor);
            }}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(vendor.id);
            }}
            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
            title="Approve"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRejectClick(vendor.id);
            }}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            title="Reject"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // pagination removed; totalVendors available for informational UI

  if (loading && vendors.length === 0 && pendingVendors.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendors Management</h1>
            <p className="text-purple-100 mt-1">Manage vendor registrations and approvals</p>
          </div>
          <Store className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-2">
        <button
          onClick={() => {
            setActiveTab('all');
          }}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Vendors
        </button>
        <button
          onClick={() => {
            setActiveTab('pending');
          }}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Pending Approval ({pendingVendors.length})
        </button>
      </div>

      {/* Filters (for All Vendors tab) */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div>
          </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <DataTable
            data={activeTab === 'all' ? vendors : pendingVendors}
            columns={activeTab === 'all' ? allVendorsColumns : pendingVendorsColumns}
            emptyMessage={activeTab === 'all' ? 'No vendors found' : 'No pending vendors'}
          />
        )}
      </div>

      {/* Pagination removed; API returns full lists */}

      {/* Vendor Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Vendor Details">
        {detailLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : selectedVendor ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                <p className="text-gray-900">{selectedVendor.businessName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name</label>
                <p className="text-gray-900">{selectedVendor.contactName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedVendor.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{selectedVendor.mobile}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedVendor.status || 'PENDING')}`}>
                  {selectedVendor.status || 'PENDING'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Approval Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalBadge(selectedVendor.approvalStatus || 'PENDING')}`}>
                  {selectedVendor.approvalStatus || 'PENDING'}
                </span>
              </div>
            </div>

            {selectedVendor.aboutBusiness && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About Business</label>
                <p className="text-sm text-gray-900">{selectedVendor.aboutBusiness}</p>
              </div>
            )}

            {selectedVendor.cuisinesOffered && selectedVendor.cuisinesOffered.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cuisines</label>
                <p className="text-sm text-gray-900">{selectedVendor.cuisinesOffered.join(', ')}</p>
              </div>
            )}

            {selectedVendor.specialties && selectedVendor.specialties.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Specialties</label>
                <p className="text-sm text-gray-900">{selectedVendor.specialties.join(', ')}</p>
              </div>
            )}

            {selectedVendor.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="block text-sm font-semibold text-red-700 mb-1">Rejection Reason</label>
                <p className="text-sm text-red-900">{selectedVendor.rejectionReason}</p>
              </div>
            )}

            {selectedVendor.addresses && selectedVendor.addresses.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Addresses</label>
                {selectedVendor.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 mb-2">
                    <p className="text-sm text-gray-900">
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedVendor.licenseDocuments && selectedVendor.licenseDocuments.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">License Documents</label>
                {selectedVendor.licenseDocuments.map((doc, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 mb-2">
                    <p className="text-sm font-medium text-gray-900">{doc.documentType}</p>
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            )}

            {selectedVendor.documents && selectedVendor.documents.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Uploaded Documents</label>
                {selectedVendor.documents.map((doc, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 mb-2">
                    <p className="text-sm font-medium text-gray-900">{doc.documentName || doc.documentType}</p>
                    <p className="text-xs text-gray-600">Number: {doc.documentNumber}</p>
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            )}

            {selectedVendor.capacity && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                <p className="text-sm text-gray-900">Min: {selectedVendor.capacity.minGuests || '-'} | Max: {selectedVendor.capacity.maxGuests || '-'}</p>
              </div>
            )}

            {selectedVendor.pricing && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pricing</label>
                <p className="text-sm text-gray-900">{selectedVendor.pricing.currency || ''} {selectedVendor.pricing.startingPricePerPlate || '-'} starting</p>
              </div>
            )}

            {selectedVendor.ratings && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ratings</label>
                <p className="text-sm text-gray-900">{selectedVendor.ratings.averageRating || 0} ({selectedVendor.ratings.totalReviews || 0} reviews)</p>
              </div>
            )}

            {selectedVendor.ownerInfo && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Owner</label>
                <p className="text-sm text-gray-900">{selectedVendor.ownerInfo.firstName} {selectedVendor.ownerInfo.lastName} — {selectedVendor.ownerInfo.phone}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">No vendor selected</div>
        )}
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason('');
          setVendorToReject(null);
        }}
        title="Reject Vendor"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Provide a reason for rejecting this vendor..."
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRejectConfirm}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl hover:from-red-700 hover:to-red-800"
            >
              Confirm Reject
            </button>
            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
                setVendorToReject(null);
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Vendors;

