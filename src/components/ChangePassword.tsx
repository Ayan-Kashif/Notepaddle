// Admin/ChangePassword.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import '../i18n';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const navigate = useNavigate();
const { t } = useTranslation()
  const handleChange = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return toast.error('Unauthorized access. Please log in.');

    if (!current || !newPass) return toast.error('All fields are required.');

    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/change-password`,
        {
          currentPassword: current,
          newPassword: newPass,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Password changed successfully!');
      setCurrent('');
      setNewPass('');
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Failed to change password.';
      toast.error(msg);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full backdrop-blur-md bg-white shadow-md sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
              alt="Notepadle"
              className="w-9 h-9 object-contain rounded shadow"
            />
            <h1
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              style={{ fontFamily: `'Playfair Display', serif` }}
            >
              Notepadle
            </h1>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-300"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
        </div>
      </nav>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-4">
        <Toaster position="top-center" />



        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              {t('admin.change_password.title')}
          </h2>

          <input
            type="password"
         placeholder={t('admin.change_password.current_placeholder')}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />

          <input
            type="password"
           placeholder={t('admin.change_password.new_placeholder')}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleChange}
            className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300"
          >
            {t('admin.change_password.button')}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
