import React, { useEffect, useState } from 'react';
import type { Announcement, CreateAnnouncementRequest } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Trash2 } from 'lucide-react';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateAnnouncementRequest>({
    title: '',
    content: '',
    type: 'INFO',
    targetAudience: 'ALL',
    startDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      // Mock data
      const data: Announcement[] = [
        {
          id: '1',
          title: 'Platform Maintenance',
          content: 'Scheduled maintenance on Sunday 2AM-4AM',
          type: 'INFO',
          targetAudience: 'ALL',
          startDate: '2026-01-30',
          isActive: true,
          createdBy: 'admin-1',
          createdByName: 'Admin User',
          createdAt: '2026-01-25T10:00:00Z',
          updatedAt: '2026-01-25T10:00:00Z'
        },
        {
          id: '2',
          title: 'New Features Released',
          content: 'Check out our new menu management features!',
          type: 'INFO',
          targetAudience: 'VENDORS',
          startDate: '2026-01-27',
          isActive: true,
          createdBy: 'admin-1',
          createdByName: 'Admin User',
          createdAt: '2026-01-27T08:00:00Z',
          updatedAt: '2026-01-27T08:00:00Z'
        }
      ];
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      // Mock create - add to local state
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        ...formData,
        createdBy: 'admin-1',
        createdByName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      // Mock delete - remove from local state
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'INFO',
      targetAudience: 'ALL',
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (ann: Announcement) => (
        <div>
          <p className="font-semibold text-gray-900">{ann.title}</p>
          <p className="text-sm text-gray-500">{ann.content.substring(0, 50)}...</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (ann: Announcement) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            ann.type === 'URGENT'
              ? 'bg-red-100 text-red-800'
              : ann.type === 'WARNING'
              ? 'bg-yellow-100 text-yellow-800'
              : ann.type === 'MAINTENANCE'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {ann.type}
        </span>
      ),
    },
    {
      key: 'targetAudience',
      header: 'Audience',
      render: (ann: Announcement) => (
        <span className="text-sm text-gray-600">{ann.targetAudience}</span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (ann: Announcement) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            ann.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {ann.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (ann: Announcement) => (
        <span className="text-sm text-gray-600">
          {new Date(ann.startDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (ann: Announcement) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(ann.id);
          }}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Announcements</h1>
            <p className="text-pink-100 mt-1">Manage platform announcements</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-white text-pink-600 px-4 py-2 rounded-xl hover:bg-pink-50"
          >
            <Plus className="w-5 h-5" />
            New Announcement
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <DataTable data={announcements} columns={columns} />
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create Announcement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'INFO' | 'WARNING' | 'URGENT' | 'MAINTENANCE',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
              >
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="URGENT">Urgent</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAudience: e.target.value as 'ALL' | 'USERS' | 'VENDORS' | 'ADMINS',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
              >
                <option value="ALL">All</option>
                <option value="USERS">Users</option>
                <option value="VENDORS">Vendors</option>
                <option value="ADMINS">Admins</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span className="text-sm font-semibold text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreate}
              className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-xl hover:from-pink-700 hover:to-rose-700"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
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

export default Announcements;
