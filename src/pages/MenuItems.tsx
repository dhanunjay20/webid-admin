import React, { useEffect, useState } from 'react';
import { menuItemApi } from '../services/api';
import type { MenuItem } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Eye, Search } from 'lucide-react';

export const MenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredMenuItems(filtered);
  }, [searchQuery, categoryFilter, menuItems]);

  const loadMenuItems = async () => {
    try {
      const data = await menuItemApi.getAllMenuItems();
      setMenuItems(data);
      setFilteredMenuItems(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };



  const handleViewDetails = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setShowDetailModal(true);
  };

  const categories = ['ALL', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const columns = [
    {
      key: 'images',
      header: 'Image',
      render: (item: MenuItem) =>
        item.images && item.images[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-500">No image</span>
          </div>
        ),
    },
    { key: 'name', header: 'Name' },
    { key: 'vendorName', header: 'Vendor' },
    { key: 'category', header: 'Category' },
    { key: 'subCategory', header: 'Sub-Category' },
    {
      key: 'available',
      header: 'Available',
      render: (item: MenuItem) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.available
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {item.available ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: MenuItem) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(item);
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
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Menu Items Management</h1>
            <p className="text-red-100 mt-1">Manage all vendor menu items</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
            <p className="text-sm text-red-100 font-medium">Total Items</p>
            <p className="text-3xl font-bold">{menuItems.length}</p>
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
                placeholder="Search menu items by name, vendor, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all duration-200"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium text-gray-700 transition-all duration-200"
            >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable data={filteredMenuItems} columns={columns} emptyMessage="No menu items found" />

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Menu Item Details"
        size="lg"
      >
        {selectedMenuItem && (
          <div className="space-y-4">
            {selectedMenuItem.images && selectedMenuItem.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {selectedMenuItem.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedMenuItem.name} ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900 font-semibold">{selectedMenuItem.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Vendor</label>
                <p className="text-gray-900">{selectedMenuItem.vendorName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-gray-900">{selectedMenuItem.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sub-Category</label>
                <p className="text-gray-900">{selectedMenuItem.subCategory}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Available</label>
                <p className="text-gray-900">{selectedMenuItem.available ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Description</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedMenuItem.description}</p>
            </div>

            {selectedMenuItem.ingredients && selectedMenuItem.ingredients.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Ingredients</label>
                <div className="flex flex-wrap gap-2">
                  {selectedMenuItem.ingredients.map((ingredient, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedMenuItem.spiceLevels && selectedMenuItem.spiceLevels.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Spice Levels</label>
                <div className="flex flex-wrap gap-2">
                  {selectedMenuItem.spiceLevels.map((level, idx) => (
                    <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {level}
                    </span>
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

export default MenuItems;
