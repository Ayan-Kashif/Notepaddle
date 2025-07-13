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

const getFlagEmoji = (code: string) => {
  const flags: Record<string, string> = {
    en: "🇺🇸",
    pt: "🇵🇹",
    cs: "🇨🇿",
    da: "🇩🇰",
    de: "🇩🇪",
    es: "🇪🇸",
    fr: "🇫🇷",
    it: "🇮🇹",
    id: "🇮🇩",
    ms: "🇲🇾",
    nl: "🇳🇱",
    no: "🇳🇴",
    pl: "🇵🇱",
    fi: "🇫🇮",
    sv: "🇸🇪",
    vi: "🇻🇳",
    tr: "🇹🇷",
    el: "🇬🇷",
    ru: "🇷🇺",
    uk: "🇺🇦",
    he: "🇮🇱",
    ar: "🇸🇦",
    hi: "🇮🇳",
    th: "🇹🇭",
    ko: "🇰🇷",
    zh: "🇨🇳",
    "zh-Hant": "🇹🇼",
    ja: "🇯🇵",
  };
  return flags[code] || "🌐";
};

const Footer: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [showLangModal, setShowLangModal] = useState(false);

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangModal(false);
  };

  useEffect(() => {
    const rtlLangs = ["ur", "ar", "he"];
    document.body.dir = rtlLangs.includes(i18n.language) ? "rtl" : "ltr";
  }, [i18n.language]);

  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
  const [isReportAbusePolicyOpen, setIsReportAbusePolicyOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const languages = [
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "cs", name: "Čeština" },
    { code: "da", name: "Dansk" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
    { code: "id", name: "Bahasa Indonesia" },
    { code: "ms", name: "Bahasa Melayu" },
    { code: "nl", name: "Nederlands" },
    { code: "no", name: "Norsk" },
    { code: "pl", name: "Polski" },
    { code: "fi", name: "Suomi" },
    { code: "sv", name: "Svenska" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "tr", name: "Türkçe" },
    { code: "el", name: "Ελληνικά" },
    { code: "ru", name: "Русский" },
    { code: "uk", name: "Українська" },
    { code: "he", name: "עברית" },
    // { code: "ar", name: "العربية" },
    { code: "hi", name: "हिन्दी" },
    { code: "th", name: "ภาษาไทย" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文(简体)" },
    { code: "zh-Hant", name: "中文(繁體)" },
    { code: "ja", name: "日本語" },
  ];

  return (
    <>
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20 mt-12 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

            {/* Links */}
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
                    to="https://blog.notepaddle.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {t("blog")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
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
                  href="mailto:support@notepaddle.com"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Language */}
            <div>
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => setShowLangModal(true)}
              >
                <FaGlobe className="text-blue-500 w-4 h-4 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {getFlagEmoji(i18n.language)}{" "}
                  {languages.find((l) => l.code === i18n.language)?.name || "Language"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
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

      {/* Language Popup */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("select_language")}
              </h2>
              <button
                onClick={() => setShowLangModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleChange(lang.code)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                      i18n.language === lang.code
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getFlagEmoji(lang.code)}</span>
                      <span>{lang.name}</span>
                    </div>
                    {i18n.language === lang.code && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PrivacyPolicy isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />
      <TermsOfService isOpen={isTermsOfServiceOpen} onClose={() => setIsTermsOfServiceOpen(false)} />
      <ReportAbusePolicy isOpen={isReportAbusePolicyOpen} onClose={() => setIsReportAbusePolicyOpen(false)} />
    </>
  );
};

export default Footer;





