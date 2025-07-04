//   import React, { useState } from 'react';
//   import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
//   import EmailVerificationModal from './EmailVerificationModal';
//   import ForgotPasswordModal from './ForgotPasswordModal';

//   interface AuthModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
//     onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
//     onResendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
//     onVerifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
//     onResetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
//   }

//   const onRegister = async (email: string, password: string, name: string) => {
//   try {
//     const res = await fetch('http://localhost:5000/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password, name }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       localStorage.setItem('token', data.token);
//       return { success: true };
//     } else {
//       return { success: false, error: data.message };
//     }
//   } catch (error) {
//     return { success: false, error: 'Network error' };
//   }
// };

//   const AuthModal: React.FC<AuthModalProps> = ({
//     isOpen,
//     onClose,
//     onLogin,
//     onRegister,
//     onResendVerification,
//     onVerifyEmail,
//     onResetPassword,
//   }) => {
//     const [isLoginMode, setIsLoginMode] = useState(true);
//     const [formData, setFormData] = useState({
//       email: '',
//       password: '',
//       name: '',
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
//     const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
//     const [registeredEmail, setRegisteredEmail] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setIsLoading(true);
//       setError('');

//       try {
//         let result;
//         if (isLoginMode) {
//           result = await onLogin(formData.email, formData.password);
//         } else {
//           result = await onRegister(formData.email, formData.password, formData.name);
//         }

//         if (result.success) {
//           if (!isLoginMode) {
//             // Show email verification modal for new registrations
//             setRegisteredEmail(formData.email);
//             setIsEmailVerificationOpen(true);
//           } else {
//             onClose();
//             setFormData({ email: '', password: '', name: '' });
//           }
//         } else {
//           setError(result.error || 'An error occurred');
//         }
//       } catch (err) {
//         setError('An unexpected error occurred');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormData(prev => ({
//         ...prev,
//         [e.target.name]: e.target.value,
//       }));
//       setError('');
//     };

//     const toggleMode = () => {
//       setIsLoginMode(!isLoginMode);
//       setError('');
//       setFormData({ email: '', password: '', name: '' });
//     };

//     const handleEmailVerificationClose = () => {
//       setIsEmailVerificationOpen(false);
//       onClose();
//       setFormData({ email: '', password: '', name: '' });
//     };

//     const handleForgotPassword = () => {
//       setIsForgotPasswordOpen(true);
//     };

//     if (!isOpen) return null;

//     return (
//       <>
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex items-center space-x-3">
//                 <img 
//                   src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png" 
//                   alt="Notepadle" 
//                   className="w-8 h-8 object-contain"
//                 />
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                     {isLoginMode ? 'Welcome Back' : 'Create Account'}
//                   </h2>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {isLoginMode ? 'Sign in to your Notepadle account' : 'Join Notepadle today'}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {!isLoginMode && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Full Name
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-200"
//                         placeholder="Enter your full name"
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-200"
//                       placeholder="Enter your email"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-200"
//                       placeholder="Enter your password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                     >
//                       {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                     </button>
//                   </div>
//                 </div>

//                 {isLoginMode && (
//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       onClick={handleForgotPassword}
//                       className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                 )}

//                 {error && (
//                   <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                     <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//                 >
//                   {isLoading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
//                 </button>
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   {isLoginMode ? "Don't have an account?" : "Already have an account?"}
//                   <button
//                     onClick={toggleMode}
//                     className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
//                   >
//                     {isLoginMode ? 'Sign up' : 'Sign in'}
//                   </button>
//                 </p>
//               </div>

//               <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//                 <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
//                   💡 You can continue using the app without signing up. Your notes will be saved locally in your browser.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <EmailVerificationModal
//           isOpen={isEmailVerificationOpen}
//           onClose={handleEmailVerificationClose}
//           email={registeredEmail}
//           onResend={() => onResendVerification(registeredEmail)}
//           onVerify={onVerifyEmail}
//         />

//         <ForgotPasswordModal
//           isOpen={isForgotPasswordOpen}
//           onClose={() => setIsForgotPasswordOpen(false)}
//           onResetPassword={onResetPassword}
//         />
//       </>
//     );
//   };

//   export default AuthModal;
import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
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
