import React, { useEffect, useState } from 'react';
import { vendorApi } from '../services/api';
import type { Vendor } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Trash2, Eye, ToggleLeft, ToggleRight, Search } from 'lucide-react';

export const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = vendors.filter(
        (vendor) =>
          vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.contactName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVendors(filtered);
    } else {
      setFilteredVendors(vendors);
    }
  }, [searchQuery, vendors]);

  const loadVendors = async () => {
    try {
      const data = await vendorApi.getAllVendors();
      setVendors(data);
      setFilteredVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorApi.deleteVendor(id);
        loadVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus?: boolean) => {
    try {
      await vendorApi.updateVendorStatus(id, !currentStatus);
      loadVendors();
    } catch (error) {
      console.error('Error updating vendor status:', error);
    }
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDetailModal(true);
  };

  const columns = [
    { key: 'businessName', header: 'Business Name' },
    { key: 'contactName', header: 'Contact' },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Phone' },
    {
      key: 'isOnline',
      header: 'Status',
      render: (vendor: Vendor) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            vendor.isOnline
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {vendor.isOnline ? 'Online' : 'Offline'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vendor: Vendor) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(vendor);
            }}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(vendor.id, vendor.isOnline);
            }}
            className="text-purple-600 hover:text-purple-800 p-1"
            title="Toggle Status"
          >
            {vendor.isOnline ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(vendor.id);
            }}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendors Management</h1>
            <p className="text-purple-100 mt-1">Manage all registered vendors</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm text-purple-100 font-medium">Total Vendors</p>
            <p className="text-3xl font-bold">{vendors.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vendors by business name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200"
        />
        </div>
      </div>

      <DataTable data={filteredVendors} columns={columns} emptyMessage="No vendors found" />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Vendor Details"
        size="lg"
      >
        {selectedVendor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Business Name</label>
                <p className="text-gray-900 font-semibold">{selectedVendor.businessName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Name</label>
                <p className="text-gray-900">{selectedVendor.contactName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedVendor.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{selectedVendor.mobile}</p>
              </div>
              {selectedVendor.website && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Website</label>
                  <a
                    href={selectedVendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedVendor.website}
                  </a>
                </div>
              )}
              {selectedVendor.yearsInBusiness && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Years in Business</label>
                  <p className="text-gray-900">{selectedVendor.yearsInBusiness}</p>
                </div>
              )}
            </div>

            {selectedVendor.aboutBusiness && (
              <div>
                <label className="text-sm font-medium text-gray-600">About Business</label>
                <p className="text-gray-900 text-sm">{selectedVendor.aboutBusiness}</p>
              </div>
            )}

            {selectedVendor.addresses && selectedVendor.addresses.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Addresses</label>
                {selectedVendor.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg mb-2">
                    <p className="text-sm text-gray-900">
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedVendor.licenseDocuments && selectedVendor.licenseDocuments.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">License Documents</label>
                {selectedVendor.licenseDocuments.map((doc, idx) => (
                  <div key={idx} className="bg-blue-50 p-3 rounded-lg mb-2">
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Vendors;
