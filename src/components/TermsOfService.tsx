import React from 'react';
import { X, FileText, Shield, Users, AlertTriangle, Scale, Mail, Calendar } from 'lucide-react';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 mt-28 md:mt-2 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms of Service
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Terms and conditions for using Notepadle
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
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <h1 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                Terms of Service – Notepadle
              </h1>
              <div className="flex items-center space-x-4 text-sm text-green-700 dark:text-green-300">
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

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-indigo-600" />
                1. Acceptance of Terms
              </h2>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By accessing or using Notepadle ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all 
                  visitors, users, and others who access or use the Service.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                2. Description of Service
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Notepadle is a digital note-taking application that allows users to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Create, edit, and organize personal notes</li>
                  <li>Save notes locally in their browser or to cloud storage (with account)</li>
                  <li>Export notes in various formats (text, markdown, PDF, etc.)</li>
                  <li>Share and collaborate on notes with others</li>
                  <li>Use advanced features like categories, tags, and search</li>
                  <li>Protect notes with password encryption</li>
                  <li>Receive email notifications for account-related activities</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  The service is free to use and may offer optional premium features for registered users.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> support@notepadle.com</p>
                  <p><strong>Subject Line:</strong> Terms of Service Inquiry</p>
                  <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Terms Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-green-700 dark:text-green-300">✓ Your Rights:</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Own your content completely</li>
                    <li>• Export data anytime</li>
                    <li>• Use service anonymously</li>
                    <li>• Delete account anytime</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">ℹ Your Responsibilities:</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Follow content guidelines</li>
                    <li>• Keep account secure</li>
                    <li>• Respect others' rights</li>
                    <li>• Backup important data</li>
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

export default TermsOfService;
