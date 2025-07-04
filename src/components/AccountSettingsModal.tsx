




import React, { useState, useRef } from 'react';
import {
  X, User, Mail, Lock, Camera, Save, Eye, EyeOff,
  Shield, Bell, Palette, Globe, Download, Trash2,
  AlertTriangle, Check, Upload
} from 'lucide-react';
import axios from 'axios';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  token: string; // Add token for authentication
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  token,
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API client configuration
  const api = axios.create({
    baseURL: 'http://localhost:5000/api/users', // Update with your API URL
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Update form data when user prop changes
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      }));
      setProfileImage(user.avatar || null);
      console.log(profileImage)
    }
  }, [user]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage({ type: '', text: '' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfileImage(response.data.avatar);
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      setMessage({ type: 'error', text: 'Name and email are required' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/profile', {
        name: formData.name,
        email: formData.email,
        bio: formData.bio
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put('/password', {
        currentPassword,
        newPassword
      });

      setMessage({ type: 'success', text: response.data.message || 'Password changed successfully!' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your notes will be permanently deleted.')) {
      setIsLoading(true);
      try {
        await api.delete('/');
        localStorage.removeItem('token')
        setMessage({ type: 'success', text: 'Account deleted successfully. Redirecting...' });
        // Redirect or handle account deletion in parent component
        setTimeout(() => {
          window.location.href = '/'; // Or use your router
        }, 2000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      fetch('http://localhost:5000/api/users/export', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not OK');
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'my-export.txt'; // Can be dynamic
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(error => {
          console.error('Download failed:', error);
        });

      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      // setMessage({ type: 'error', text: 'Failed to initiate data export. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setActiveTab('profile');
    setMessage({ type: '', text: '' });
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setProfileImage(user.avatar || null);
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !user) return null;

  const tabs = [
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'account', name: 'Account', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'data', name: 'Account Data', icon: Download },
  ];

  // Rest of your JSX remains the same...
  // Only the handler functions have been updated

  return (
    <div
      className="fixed inset-0 bg-black/50 mt-[300px] backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden relative mx-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: 'calc(100vh - 2rem)',
          maxWidth: '64rem',
          width: '100%',
          margin: '0 auto'
        }}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(85vh-120px)] max-h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-200 ${activeTab === tab.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  }`}>
                  <div className="flex items-center">
                    {message.type === 'success' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-2" />
                    )}
                    {message.text}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Profile Information
                    </h3>

                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="relative">
                        {profileImage ? (
                          <img
                            src={`http://localhost:5000/${profileImage}`}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xl">
                              {getInitials(formData.name)}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors duration-200"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Profile Picture
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Upload a new profile picture. Max size: 5MB
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                        >
                          <Upload className="w-3 h-3 mr-2" />
                          Upload Image
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="inline-flex mt-2 items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4  h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleChangePassword();
                    }}>
                      <div className="space-y-4 max-w-md">
                        {/* Current Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              required
                            />
                            {/* ... visibility toggle button ... */}
                          </div>
                        </div>

                        {/* New Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              required
                              minLength={6}
                            />
                            {/* ... visibility toggle button ... */}
                          </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              required
                              minLength={6}
                            />
                            {/* ... visibility toggle button ... */}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Account Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Account Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Account Created:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Account Type:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">2.3 MB / Unlimited</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      App Preferences
                    </h3>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Email Notifications
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Receive email updates about your notes
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Auto-save Notes
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Automatically save changes as you type
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Default Note Visibility
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Choose the default privacy setting for new notes
                            </p>
                          </div>
                        </div>
                        <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                          <option value="private">Private (only you can see)</option>
                          <option value="public">Public (anyone with link can view)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Account Data
                    </h3>

                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Export Your Data
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                              Download a copy of all your notes and account data. This includes all your notes, categories, and settings.
                            </p>
                            <button
                              onClick={handleExportData}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export Data
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                              Delete Account
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <button
                              onClick={handleDeleteAccount}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;