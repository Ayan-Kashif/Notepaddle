import React, { useState } from 'react';
import {
  Heart,
  Github,
  Twitter,
  Mail,
  Shield,
  FileText,
  AlertTriangle,
  LayoutDashboard
} from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ReportAbusePolicy from './ReportAbusePolicy';
import {Link} from 'react-router-dom'

const Footer: React.FC = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
  const [isReportAbusePolicyOpen, setIsReportAbusePolicyOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-white/80 dark:bg-gray-900/80  backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20 mt-12 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand Section */}
            <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                <div
                  
                  className="flex items-center gap-3 "
                >
                  <img
                    src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
                    alt="Notepadle"
                    className="w-10 h-10 object-contain rounded-md shadow"
                  />
                  <h1
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
                    style={{ fontFamily: `'Playfair Display', serif` }}
                  >
                    Notepadle
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center sm:text-left">
                Your everyday digital companion for capturing thoughts and ideas.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => setIsPrivacyPolicyOpen(true)}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center"
                  >
                    <Shield className="w-3 h-3 mr-2" />
                    Privacy Policy
                  </button>
                </li>
                <li className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => setIsTermsOfServiceOpen(true)}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center"
                  >
                    <FileText className="w-3 h-3 mr-2" />
                    Terms of Service
                  </button>
                </li>
                <li className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => setIsReportAbusePolicyOpen(true)}
                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm transition-colors duration-200 flex items-center"
                  >
                    <AlertTriangle className="w-3 h-3 mr-2" />
                    Report Abuse
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
              <div className="flex justify-center sm:justify-start space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="mailto:support@notepadle.com"
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200"
                  title="Email Support"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

         
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-200/20 dark:border-gray-700/20">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                <span>© {currentYear} Notepadle. Made with</span>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span>for productivity enthusiasts.</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-right">
                Version 1.0.0 
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyPolicy
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />
      <TermsOfService
        isOpen={isTermsOfServiceOpen}
        onClose={() => setIsTermsOfServiceOpen(false)}
      />
      <ReportAbusePolicy
        isOpen={isReportAbusePolicyOpen}
        onClose={() => setIsReportAbusePolicyOpen(false)}
      />
    </>
  );
};

export default Footer;


