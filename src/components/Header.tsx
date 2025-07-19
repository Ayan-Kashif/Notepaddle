import React, { useState ,useEffect,Suspense,lazy} from 'react';
import { Search, Moon, Sun, Plus, LogIn, Menu, X } from 'lucide-react';
// import UserMenu from './UserMenu';
// import AuthModal from './AuthModal';
const AuthModal = lazy(() => import('./AuthModal'));
const UserMenu = lazy(() => import('./UserMenu'));
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../i18n.js';
import { User } from 'lucide-react';
import { FaGlobe } from "react-icons/fa";
import { Check, ChevronDown } from "lucide-react";
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onNewNote: () => void;
  user: any;
   isLogin: boolean;
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onResendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  onVerifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  onResetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  onOpenAuthModal: () => void;
  onCloseAuthModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDark,
  onThemeToggle,
  onNewNote,
  user,
  isAuthenticated,
  onLogin,
  onRegister,
  onLogout,
  isLogin,
  onToggleSidebar,
  isSidebarOpen,
  onResendVerification,
  onVerifyEmail,
  onResetPassword,
  isAuthModalOpen,
  onOpenAuthModal,
  onCloseAuthModal,
}) => {
  const navigate = useNavigate()
  const { i18n, t } = useTranslation();

  const [showLangModal, setShowLangModal] = useState(false);

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
    // { code: "he", name: "עברית" },
    // { code: "ar", name: "العربية" },
    { code: "hi", name: "हिन्दी" },
    { code: "th", name: "ภาษาไทย" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文(简体)" },
    { code: "zh-Hant", name: "中文(繁體)" },
    { code: "ja", name: "日本語" },
  ];

  const getFlagEmoji = (code: string) => {
    const flags: Record<string, string> = {
      en: "🇺🇸", pt: "🇵🇹", cs: "🇨🇿", da: "🇩🇰", de: "🇩🇪", es: "🇪🇸",
      fr: "🇫🇷", it: "🇮🇹", id: "🇮🇩", ms: "🇲🇾", nl: "🇳🇱", no: "🇳🇴",
      pl: "🇵🇱", fi: "🇫🇮", sv: "🇸🇪", vi: "🇻🇳", tr: "🇹🇷", el: "🇬🇷",
      ru: "🇷🇺", uk: "🇺🇦", he: "🇮🇱", ar: "🇸🇦", hi: "🇮🇳", th: "🇹🇭",
      ko: "🇰🇷", zh: "🇨🇳", "zh-Hant": "🇹🇼", ja: "🇯🇵",
    };
    return flags[code] || "🌐";
  };

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangModal(false);
  };

  useEffect(() => {
    const rtlLangs = ["ur", "ar", "he"];
    document.body.dir = rtlLangs.includes(i18n.language) ? "rtl" : "ltr";
  }, [i18n.language]);


  return (
    <>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center space-x-3">
                {/* Logo & Name */}
                  <div onClick={()=>window.location.reload()} className="flex items-center cursor-pointer space-x-3">
                <img 
                  src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png" 
                  alt="Notepadle" 
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Notepadle
                </h1>
              </div>
              </div>
            </div>

          
            {/* Search bar - hidden on small screens, shown on medium+ */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                   placeholder={t('search_notes')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile search button */}
              <button
                onClick={() => {
                  const searchInput = document.getElementById('mobile-search');
                  if (searchInput) {
                    searchInput.focus();
                  }
                }}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={onNewNote}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('new_note')}</span>
              </button>

              <button
                onClick={onThemeToggle}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
       <Suspense fallback={<div>Loading...</div>}>
                <UserMenu user={user} onLogout={onLogout} />
               </Suspense>
              ) : (
                <button
                 onClick={() => onOpenAuthModal(true)}
                  className="inline-flex items-center px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('sign_in')}</span>
                </button>
              )}

               <div
                className="flex items-center space-x-1 cursor-pointer group"
                onClick={() => setShowLangModal(true)}
              >
                <FaGlobe className="text-blue-500 w-4 h-4 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {getFlagEmoji(i18n.language)} {languages.find((l) => l.code === i18n.language)?.name}
                </span>
              </div>
              
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="mobile-search"
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/20 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </header>
        <Suspense fallback={<div>Loading...</div>}>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthModal}
        onLogin={onLogin}
        isLogin={isLogin}
        onRegister={onRegister}
        onResendVerification={onResendVerification}
        onVerifyEmail={onVerifyEmail}
        onResetPassword={onResetPassword}
      />
            </Suspense>

          {showLangModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
               Select Language
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
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${i18n.language === lang.code
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
    </>
  );
};

export default Header;
