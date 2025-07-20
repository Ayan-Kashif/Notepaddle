
import React, { useState, useEffect } from "react";
import {
  Heart,
  X,
  Facebook,
  Instagram,
  Newspaper,
  Mail,
  FileText,
  Shield,
  AlertTriangle,
  ChevronDown,
  Check,
} from "lucide-react";
import { FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import ReportAbusePolicy from "./ReportAbusePolicy";
import { useTranslation } from "react-i18next";
import "../i18n.js";


const Footer: React.FC = () => {
  const { i18n, t } = useTranslation();
  



  useEffect(() => {
    const rtlLangs = ["ur", "ar", "he"];
    document.body.dir = rtlLangs.includes(i18n.language) ? "rtl" : "ltr";
  }, [i18n.language]);

  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
  const [isReportAbusePolicyOpen, setIsReportAbusePolicyOpen] = useState(false);
  const currentYear = new Date().getFullYear();



 
  return (
    <>


      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20 mt-12 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <img
                  src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
                  alt="Notepadle"
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Notepadle
                </h1>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("site_tagline")}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("quick_links")}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <button
                    onClick={() => setIsPrivacyPolicyOpen(true)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {t("privacy_policy")}
                  </button>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <button
                    onClick={() => setIsTermsOfServiceOpen(true)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {t("terms_of_service")}
                  </button>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <button
                    onClick={() => setIsReportAbusePolicyOpen(true)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {t("report_abuse")}
                  </button>
                </li>
                <li className="flex items-center space-x-2">
                  <Newspaper className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <Link
                    to="https://notepadle.com/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {t("blog")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("connect")}
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/notepadle/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/notepadle/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/notepadle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  title="Twitter"
                >
                  <X className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-4 border-t border-gray-200/20 dark:border-gray-700/20 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-6">
            <div className="flex items-center space-x-1">
              <span>{t("footer_copyright", { year: currentYear })}</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>{t("footer_purpose")}</span>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {t("footer_version")}
            </div>
          </div>
        </div>

     
      </footer>
   {/* Modals */}
        <PrivacyPolicy isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />
        <TermsOfService isOpen={isTermsOfServiceOpen} onClose={() => setIsTermsOfServiceOpen(false)} />
        <ReportAbusePolicy isOpen={isReportAbusePolicyOpen} onClose={() => setIsReportAbusePolicyOpen(false)} />
    </>
  )

};

export default Footer;





