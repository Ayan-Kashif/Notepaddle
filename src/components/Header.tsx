import React, { useState } from 'react';
import { Search, Moon, Sun, Plus, LogIn, Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onNewNote: () => void;
  user: any;
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
                  <div className="flex items-center space-x-3">
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
                  placeholder="Search notes..."
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
                <span className="hidden sm:inline">New Note</span>
              </button>

              <button
                onClick={onThemeToggle}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <UserMenu user={user} onLogout={onLogout} />
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthModal}
        onLogin={onLogin}
        onRegister={onRegister}
        onResendVerification={onResendVerification}
        onVerifyEmail={onVerifyEmail}
        onResetPassword={onResetPassword}
      />
    </>
  );
};

export default Header;
