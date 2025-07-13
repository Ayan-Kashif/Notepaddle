import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import '../i18n';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';


export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) navigate('/admin/dashboard');
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/login`, {
        email,
        password,
      });

      localStorage.setItem('adminToken', data.token);
      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <nav className="w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
              alt="Notepadle"
              className="w-9 h-9 object-contain"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Notepadle
            </h1>
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-4">



        {/* Updated Navbar */}


        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 mt-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">{t('admin.login.title')}</h2>
          <input
            type="email"
             placeholder={t('admin.login.email_placeholder')}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
             placeholder={t('admin.login.password_placeholder')}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            {t('admin.login.sign_in')}
          </button>
        </motion.div>
      </div>
         <Footer />
    </>
  );
}
