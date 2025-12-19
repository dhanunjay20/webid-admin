import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Shield, Calendar, Edit2, Save, X, Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const { admin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: admin?.firstName || '',
    lastName: admin?.lastName || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
  });

  const handleSave = () => {
    // TODO: Implement API call to update profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: admin?.firstName || '',
      lastName: admin?.lastName || '',
      email: admin?.email || '',
      phone: admin?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-indigo-100 mt-1">Manage your account information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <User className="w-16 h-16 text-white" strokeWidth={2} />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2.5 shadow-lg border-2 border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group-hover:scale-110">
                  <Camera className="w-4 h-4 text-indigo-600" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mt-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {admin?.firstName} {admin?.lastName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{admin?.email}</p>
                <div className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl border border-indigo-200">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">
                    {admin?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="w-full mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">24</p>
                    <p className="text-xs text-gray-600 mt-1">Actions Today</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">158</p>
                    <p className="text-xs text-gray-600 mt-1">Total Actions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>First Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium border border-gray-200">
                    {admin?.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Last Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium border border-gray-200">
                    {admin?.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Email Address</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium border border-gray-200">
                    {admin?.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span>Phone Number</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                    placeholder="Not set"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium border border-gray-200">
                    {admin?.phone || 'Not set'}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Role</span>
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium border border-gray-200">
                  {admin?.role?.replace('_', ' ')}
                </p>
              </div>

              {/* Created At */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Member Since</span>
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium border border-gray-200">
                  {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password regularly</p>
                  </div>
                </div>
                <Edit2 className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-gray-200 rounded-lg text-xs font-semibold text-gray-600">
                  Not Enabled
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
