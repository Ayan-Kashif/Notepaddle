import React, { useState,useEffect} from 'react';
import { Lock, Unlock, Eye, EyeOff, Key, Shield, AlertTriangle } from 'lucide-react';
import '../i18n';
import { useTranslation } from 'react-i18next';
interface PrivacySettingsProps {
  isPrivate: boolean;
  password?: string;
  passwordHint?: string;
  onPrivacyChange: (isPrivate: boolean, password?: string, passwordHint?: string) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  isPrivate,
  password,
  passwordHint,
  onPrivacyChange,
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState(password || '');
  const [newPasswordHint, setNewPasswordHint] = useState(passwordHint || '');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
    const { t } = useTranslation()

  const handlePrivacyToggle = () => {
    if (!isPrivate) {
      // Making note private - show password form
      setShowPasswordForm(true);
      setError('');
    } else {
      // Making note public - remove password protection
      onPrivacyChange(false);
      setShowPasswordForm(false);
      setNewPassword('');
      setNewPasswordHint('');
      setConfirmPassword('');
      setError('');
    }
  };

  const handlePasswordSubmit = () => {
    if (!newPassword.trim()) {
      setError('Password is required for private notes');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onPrivacyChange(true, newPassword, newPasswordHint);
    setShowPasswordForm(false);
    setError('');
  };

  const handleCancel = () => {
    setShowPasswordForm(false);
    setNewPassword(password || '');
    setNewPasswordHint(passwordHint || '');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="space-y-4">
      {/* Privacy Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isPrivate 
              ? 'bg-amber-100 dark:bg-amber-900/30' 
              : 'bg-green-100 dark:bg-green-900/30'
          }`}>
            {isPrivate ? (
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
               {isPrivate ? t('privacy_settings.private_note') : t('privacy_settings.public_note')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               {isPrivate
                ? t('privacy_settings.private_note_desc')
                : t('privacy_settings.public_note_desc')
              }
            </p>
          </div>
        </div>
        <button
          onClick={handlePrivacyToggle}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isPrivate
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50'
          }`}
        >
          {isPrivate ? t('privacy_settings.make_public') : t('privacy_settings.make_private')}
        </button>
      </div>

      {/* Password Form */}
      {showPasswordForm && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-medium text-amber-800 dark:text-amber-200">
              {t('privacy_settings.set_password_protection')}
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
               {t('privacy_settings.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                  placeholder={t('privacy_settings.password_placeholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
              {t('privacy_settings.confirm_password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                   placeholder={t('privacy_settings.confirm_password_placeholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                {t('privacy_settings.password_hint')}
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                <input
                  type="text"
                  value={newPasswordHint}
                  onChange={(e) => setNewPasswordHint(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                   placeholder={t('privacy_settings.hint_placeholder')}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors duration-200 text-sm"
            >
            {t('privacy_settings.cancel')}
            </button>
            <button
              onClick={handlePasswordSubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm"
            >
             {t('privacy_settings.set_password')}
            </button>
          </div>
        </div>
      )}

      {/* Current Password Info */}
      {isPrivate && !showPasswordForm && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
               {t('privacy_settings.password_protected')}
              </span>
            </div>
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
            >
              {t('privacy_settings.change_password')}
            </button>
          </div>
          {passwordHint && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                {t('privacy_settings.hint')}: {passwordHint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
