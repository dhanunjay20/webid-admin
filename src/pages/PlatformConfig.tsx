import React, { useEffect, useState } from 'react';
import { platformConfigApi } from '../services/api';
import type { UpdatePlatformConfigRequest } from '../types';
import { Settings, Save, Globe } from 'lucide-react';

const PlatformConfiguration: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [country, setCountry] = useState('India');
  const [formData, setFormData] = useState<UpdatePlatformConfigRequest>({});

  useEffect(() => {
    loadConfig();
  }, [country]);

  const loadConfig = async () => {
    try {
      const data = await platformConfigApi.getConfig(country);
      setFormData({
        currency: data.currency,
        platformFeePercentage: data.platformFeePercentage,
        taxRate: data.taxRate,
        minOrderAmount: data.minOrderAmount,
        maxOrderAmount: data.maxOrderAmount,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        maintenanceMode: data.maintenanceMode,
      });
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await platformConfigApi.updateConfig(formData);
      alert('Configuration updated successfully!');
    } catch (error) {
      console.error('Failed to update config:', error);
      alert('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Configuration</h1>
            <p className="text-purple-100 mt-1">Manage global platform settings</p>
          </div>
          <Settings className="w-12 h-12 opacity-50" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <input
              type="text"
              value={formData.currency || ''}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Platform Fee (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.platformFeePercentage || 0}
              onChange={(e) =>
                setFormData({ ...formData, platformFeePercentage: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.taxRate || 0}
              onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Min Order Amount
            </label>
            <input
              type="number"
              value={formData.minOrderAmount || 0}
              onChange={(e) =>
                setFormData({ ...formData, minOrderAmount: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Order Amount
            </label>
            <input
              type="number"
              value={formData.maxOrderAmount || 0}
              onChange={(e) =>
                setFormData({ ...formData, maxOrderAmount: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Support Email</label>
            <input
              type="email"
              value={formData.supportEmail || ''}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Support Phone</label>
            <input
              type="tel"
              value={formData.supportPhone || ''}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.maintenanceMode || false}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-semibold text-gray-700">Maintenance Mode</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformConfiguration;
