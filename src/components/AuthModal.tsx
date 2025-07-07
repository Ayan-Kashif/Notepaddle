

//   export default AuthModal;
import React, { useState,useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
const AuthModal: React.FC<{ isLogin: boolean; isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  isLogin
  onClose,
}) => {
  const [isLoginMode, setIsLoginMode] = useState(isLogin);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isLoginMode
      ? `${import.meta.env.VITE_BASE_URL}/api/auth/login`
      : `${import.meta.env.VITE_BASE_URL}/api/auth/register`;

    const payload = isLoginMode
      ? {
        email: formData.email,
        password: formData.password,
      }
      : {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'An error occurred. Please try again.');
      } else {
        if (isLoginMode) {
         toast.success('Login Successful!');
          window.location.reload(); // Full page reload
          localStorage.setItem('token', data.token); // Save token if applicable
          onClose();
          resetForm();
        } else {
          toast.success('Registration successful! Please check your email to verify before login.');
          setIsLoginMode(true);
          setFormData({ email: formData.email, password: '', name: '' }); // Keep email for login
        }
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

    // Sync when prop changes
  useEffect(() => {
    setIsLoginMode(isLogin);
  }, [isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const toggleMode = () => {
    setIsLoginMode(prev => !prev);
    setError('');
    resetForm();
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
  };

  if (!isOpen) return null;

  return (
    <>
    <Toaster/>
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isLoginMode ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLoginMode ? 'Sign in to continue' : 'Join us today'}
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

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Please wait...' : isLoginMode ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AuthModal;
