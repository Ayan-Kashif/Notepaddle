import React from 'react';
import { X, AlertTriangle, Mail, Shield, Clock, Eye, FileText, Calendar, MessageCircle } from 'lucide-react';

interface ReportAbusePolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportAbusePolicy: React.FC<ReportAbusePolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed mt-28 md:mt-2 inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Report Abuse Policy
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How to report inappropriate content and behavior
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
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <h1 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
                Report Abuse Policy – Notepadle
              </h1>
              <div className="flex items-center space-x-4 text-sm text-red-700 dark:text-red-300">
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
                Our Commitment to User Safety
              </h2>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  At Notepadle, we take user safety and content integrity seriously. We are committed to maintaining 
                  a safe, respectful environment for all users. If you encounter content that violates our Terms of Service 
                  or community guidelines, we encourage you to report it using the process outlined below.
                </p>
              </div>
            </section>

            {/* How to Report */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                How to Report Abuse
              </h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  Primary Reporting Method:
                </h3>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Email:</strong> <span className="text-blue-600 dark:text-blue-400">support@notepadle.com</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Subject Line:</strong> "Abuse Report - [Brief Description]"
                  </p>
                </div>

                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  Please Include the Following Information:
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Description of the Abuse</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Provide a clear, detailed description of the content or behavior that violates our policies
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Link or Location</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Share link (if available), username, note ID, or any identifying information to help us locate the content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Evidence (If Available)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Screenshots, timestamps, or other relevant evidence that supports your report
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Your Contact Information</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your email address so we can follow up if needed (kept confidential)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Abuse Reports:</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong>Email:</strong> support@notepadle.com<br />
                      <strong>Subject:</strong> "Abuse Report - [Description]"<br />
                      <strong>Response Time:</strong> Within 48 hours
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">General Support:</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong>Email:</strong> support@notepadle.com<br />
                      <strong>Subject:</strong> "General Inquiry"<br />
                      <strong>Response Time:</strong> Within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Reference
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-red-700 dark:text-red-300">📧 How to Report:</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Email: support@notepadle.com</li>
                    <li>• Include detailed description</li>
                    <li>• Provide evidence if available</li>
                    <li>• Include your contact info</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-orange-700 dark:text-orange-300">⏱️ Response Times:</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Acknowledgment: 24 hours</li>
                    <li>• Investigation: 48 hours</li>
                    <li>• Action taken if needed</li>
                    <li>• Follow-up notification</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-yellow-700 dark:text-yellow-300">🔒 Confidentiality:</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• All reports are confidential</li>
                    <li>• Reporter identity protected</li>
                    <li>• No retaliation tolerated</li>
                    <li>• Secure investigation process</li>
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

export default ReportAbusePolicy;
