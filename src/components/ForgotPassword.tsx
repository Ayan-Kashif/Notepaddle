
import { useState } from 'react';
import { motion } from 'framer-motion';

import '../i18n';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('📧 Reset link sent to your email!');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <motion.div
    //   className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200 px-4"
    //   initial={{ opacity: 0, y: 40 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.6 }}
    // >
    //   <motion.div
    //     className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
    //     initial={{ scale: 0.95 }}
    //     animate={{ scale: 1 }}
    //     transition={{ delay: 0.1 }}
    //   >
    //     <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
    //       🔑 Forgot Your Password?
    //     </h2>

    //     {message && (
    //       <motion.p className="text-green-600 text-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    //         {message}
    //       </motion.p>
    //     )}
    //     {error && (
    //       <motion.p className="text-red-600 text-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    //         {error}
    //       </motion.p>
    //     )}

    //     <form onSubmit={handleSubmit} className="space-y-5">
    //       <div>
    //         <label className="text-sm font-medium text-gray-600">Email Address</label>
    //         <input
    //           type="email"
    //           placeholder="you@example.com"
    //           className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           required
    //         />
    //       </div>

    //       <motion.button
    //         type="submit"
    //         disabled={isLoading}
    //         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 disabled:opacity-50"
    //         whileTap={{ scale: 0.95 }}
    //         whileHover={{ scale: 1.02 }}
    //       >
    //         {isLoading ? 'Sending...' : 'Send Reset Link'}
    //       </motion.button>
    //     </form>

    //     <p className="text-xs text-gray-500 text-center mt-4">
    //       We'll send you a secure link to reset your password.
    //     </p>
    //   </motion.div>
    // </motion.div>
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200 px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {t('password_reset.forgot_title')}
        </h2>

        {message && (
          <motion.p className="text-green-600 text-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {message}
          </motion.p>
        )}
        {error && (
          <motion.p className="text-red-600 text-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t('password_reset.email_label')}
            </label>
            <input
              type="email"
              placeholder={t('password_reset.email_placeholder')}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            {isLoading ? t('password_reset.sending_button') : t('password_reset.send_button')}
          </motion.button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t('password_reset.instruction_text')}
        </p>
      </motion.div>
    </motion.div>
  );
}
