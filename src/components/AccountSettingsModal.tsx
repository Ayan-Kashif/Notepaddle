



import React, { useState, useRef } from 'react';
import {
  X, User, Mail, Lock, Camera, Save, Eye, EyeOff,
  Shield, Bell, Palette, Globe, Download, Trash2,
  AlertTriangle, Check, Upload, Menu
} from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  token: string;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  token,
}) => {
  const { t } = useTranslation();
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/users`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      }));
      setProfileImage(user.avatar || null);
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

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: t('image_size_limit') });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/avatar`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfileImage(response.data.avatar);
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error) {
     setMessage({ type: 'error', text: 'Error uploading image!' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
       setMessage({ type: 'error', text: 'Fill Required Fields' });
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

       setMessage({ type: 'success', text: 'Profile saved successfully' });
    } catch (error: any) {
     const errorMessage = error.response?.data?.message || 'Error saving profile';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: t('fill_all_password_fields') });
      return;
    }

    if (newPassword !== confirmPassword) {
       setMessage({ type: 'error', text: t('password_mismatch') });
      return;
    }

    if (newPassword.length < 6) {
     setMessage({ type: 'error', text: t('password_length_error') });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put('/password', {
        currentPassword,
        newPassword
      });

     setMessage({ type: 'success', text: response.data.message || t('password_change_success') });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('password_change_error');
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
     if (window.confirm(t('delete_account_confirm'))) {
      setIsLoading(true);
      try {
        await api.delete('/');
        localStorage.removeItem('token')
         setMessage({ type: 'success', text: t('delete_account_success') });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (error) {
              setMessage({ type: 'error', text: t('delete_account_error') });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/users/export`, {
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
          a.download = 'my-export.txt';
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(error => {
          console.error('Download failed:', error);
        });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initiate data export. Please try again.' });
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
    setShowMobileMenu(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !user) return null;

  const tabs = [
    { id: 'profile', name: t('profile_tab'), icon: User },
    { id: 'account', name: t('account_tab'), icon: Shield },
    { id: 'preferences', name: t('preferences_tab'), icon: Palette },
    { id: 'data', name: t('data_tab'), icon: Download },
  ];

  return (
    <div
      className="fixed mt-24 min-h-[90vh]   inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between  p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-[10] z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
             <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {t('account_settings_title')}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {t('account_settings_subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 md:hidden"
              title={t('menu_button')}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
               title={t('close_button')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar - Mobile */}
          {showMobileMenu && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 z-20 shadow-lg">
              <nav className="p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors duration-200 ${activeTab === tab.id
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
          )}

          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-56 lg:w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
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
            <div className="p-4 md:p-6">
              {message.text && (
                <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg border ${message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  }`}>
                  <div className="flex items-center">
                    {message.type === 'success' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm md:text-base">{message.text}</span>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                      {t('profile_information')}
                    </h3>

                    {/* Profile Picture */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-4 md:mb-6">
                      <div className="relative">
                        {profileImage ? (
                          <img
                            src={`https://notepadle.com/${profileImage}`}
                            alt="Profile"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-lg sm:text-xl">
                              {getInitials(formData.name)}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors duration-200"
                        >
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {t('profile_picture')}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                         {t('upload_image')}. {t('image_size_limit')}
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm"
                        >
                          <Upload className="w-3 h-3 mr-1 sm:mr-2" />
                        {t('upload_image')}
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t('full_name')} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          {t('email_address')} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder={t('bio_placeholder')}
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="inline-flex mt-3 sm:mt-4 items-center px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isLoading ? t('saving') : t('save_changes')}
                    </button>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                      {t('change_password')}
                    </h3>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleChangePassword();
                    }}>
                      <div className="space-y-3 md:space-y-4 max-w-md">
                        {/* Current Password Field */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            {t('current_password')}
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 pr-10 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* New Password Field */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                             {t('new_password')}
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 pr-10 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                           {t('confirm_password')}
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 pr-10 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {isLoading ? t('changing') : t('change_password')}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Account Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 md:pt-6">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                    {t('account_information')}
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Account Created:</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Account Type:</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Storage Used:</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">2.3 MB / Unlimited</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                      {t('app_preferences')}
                    </h3>

                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                              {t('email_notifications')}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {t('email_notifications_desc')}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                              {t('auto_save_notes')}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {t('auto_save_notes_desc')}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                           <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                              {t('default_note_visibility')}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {t('default_note_visibility_desc')}
                            </p>
                          </div>
                        </div>
                        <select className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                          <option value="private">{t('private_visibility_option')}</option>
                          <option value="public">{t('public_visibility_option')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                      {t('account_data')}
                    </h3>

                    <div className="space-y-3 md:space-y-4">
                      <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start space-x-2 md:space-x-3">
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm sm:text-base font-medium text-blue-900 dark:text-blue-100 mb-1 md:mb-2">
                              {t('export_data')}
                            </h4>
                            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-2 md:mb-3">
                              {t('export_data_desc')}
                            </p>
                            <button
                              onClick={handleExportData}
                              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm"
                            >
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                             {t('export_data_button')}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 md:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start space-x-2 md:space-x-3">
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 mt-0.5" />
                          <div className="flex-1">
                             <h4 className="text-sm sm:text-base font-medium text-red-900 dark:text-red-100 mb-1 md:mb-2">
                              {t('delete_account')}
                            </h4>
                            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mb-2 md:mb-3">
                              {t('delete_account_desc')}
                            </p>
                            <button
                              onClick={handleDeleteAccount}
                              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-xs sm:text-sm"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                             {t('delete_account_button')}
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
