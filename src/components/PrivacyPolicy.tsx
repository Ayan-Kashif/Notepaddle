import React from 'react';
import { X, Shield, Eye, Lock, Database, Users, Mail, Calendar } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy Policy
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How we handle your data and protect your privacy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* Header */}
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                Privacy Policy – Notepadle
              </h1>
              <div className="flex items-center space-x-4 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span><strong>Effective Date:</strong> December 29, 2024</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span><strong>Last Updated:</strong> December 29, 2024</span>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                Introduction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Notepadle ("we", "our", or "us") provides a free online notepad service to help users write and save notes easily. 
                This privacy policy explains how we handle your data and our commitment to protecting your privacy.
              </p>
            </section>

            {/* What Data We Collect */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-600" />
                1. What Data We Collect
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-gray-600" />
                    Anonymous Users:
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>No personal data is collected from anonymous users</li>
                    <li>Notes are saved locally in your browser using localStorage</li>
                    <li>Theme preferences and settings are stored locally</li>
                    <li>No data is transmitted to our servers</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-indigo-600" />
                    Registered Users (Optional):
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">We may collect:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Email address for account creation and authentication</li>
                    <li>Notes you choose to save to our cloud storage</li>
                    <li>Language and theme preferences</li>
                    <li>Account creation and last login timestamps</li>
                    <li>Note sharing and collaboration settings</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Data */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-purple-600" />
                2. How We Use Your Data
              </h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>To store and sync your notes across devices</li>
                  <li>To provide access to your account and saved content</li>
                  <li>To improve the user experience and app functionality</li>
                  <li>To enable collaboration features when you choose to share notes</li>
                  <li>To provide customer support when requested</li>
                  <li>To send important account-related emails (verification, password reset)</li>
                </ul>
              </div>
            </section>

            {/* Email Communications */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                3. Email Communications
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We send emails from <strong>support@notepadle.com</strong> for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Email verification when you create an account</li>
                  <li>Password reset requests</li>
                  <li>Important security notifications</li>
                  <li>Account-related updates and changes</li>
                  <li>Customer support responses</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  We do not send promotional or marketing emails unless you explicitly opt-in.
                </p>
              </div>
            </section>

            {/* Cookies & LocalStorage */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Cookies & LocalStorage
              </h2>
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">LocalStorage Usage:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>We use localStorage to save notes for anonymous users</li>
                    <li>Theme preferences (dark/light mode) are stored locally</li>
                    <li>Category settings and note organization preferences</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Cookies Usage:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Session cookies to maintain your login state</li>
                    <li>Preference cookies for theme and language settings</li>
                    <li>No tracking or advertising cookies are used</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Us
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> support@notepadle.com</p>
                  <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Privacy Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-green-700 dark:text-green-300">✓ We Do:</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Encrypt all your data</li>
                    <li>• Respect your privacy choices</li>
                    <li>• Allow anonymous usage</li>
                    <li>• Give you full control over your data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-red-700 dark:text-red-300">✗ We Don't:</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Sell your personal information</li>
                    <li>• Use tracking cookies</li>
                    <li>• Share notes without permission</li>
                    <li>• Collect unnecessary data</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;