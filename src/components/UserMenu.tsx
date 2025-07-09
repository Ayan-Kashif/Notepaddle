import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';
import AccountSettingsModal from './AccountSettingsModal';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  useEffect(() => {
    const key = localStorage.getItem('token')
    setToken(key)
  })


  // const fetchUserFromToken = async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return null;

  //   try {
  //     const res = await axios.get('http://localhost:5000/api/auth/get-user', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return res.data;
  //   } catch (error) {
  //     console.error('Error fetching user:', error);
  //     return null;
  //   }
  // };



  const truncateEmail = (email: string, maxLength: number = 20) => {
    if (email?.length <= maxLength) return email;
    return email?.substring(0, maxLength) + '...';
  };

  const handleAccountSettings = () => {
    setIsOpen(false);
    setIsAccountSettingsOpen(true);
  };

  const handleSignOut = () => {
    setIsOpen(false);
     window.location.reload(); // Full page reload
    localStorage.removeItem('token');
     // ✅ Remove JWT token
     toast.success('Logged Out!')
    onLogout(); // ✅ Also call the logout handler to reset app state
  };
console.log(`url: ${import.meta.env.FRONTEND_URL}/${user.avatar}`)

  return (
    <>
    <Toaster/>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 max-w-xs"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user?.avatar ? (
              // Show avatar image if it exists
              <img
                 src={`${import.meta.env.FRONTEND_URL}/${user.avatar}`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              // Show initials as fallback
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {getInitials(user?.name)}
                </span>
              </div>
            )}
          </div>
          <div className="hidden sm:block text-left min-w-0 flex-1">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {truncateEmail(user?.email)}
            </p>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-lg">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={handleAccountSettings}
                className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                  <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Account Settings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage your profile and preferences
                  </p>
                </div>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-200">
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sign out of your account
                  </p>
                </div>
              </button>
            </div>

            {/* Account Stats */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {/* This would be dynamic based on actual note count */}
                    
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
        user={user}
        token={token}
      />
    </>
  );
};

export default UserMenu;
