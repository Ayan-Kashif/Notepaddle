


import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Megaphone, Download } from 'lucide-react';
import { LogOut } from 'lucide-react';
import Footer from './Footer';

import '../i18n';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const pieColors = ['#6366f1', '#f97316', '#10b981', '#f43f5e'];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [showBanned, setShowBanned] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
  }, []);


  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch {
      toast.error('Failed to fetch users');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data);
    } catch {
      toast.error('Failed to fetch statistics');
    }
  };

  const toggleBan = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/admin/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User status updated');
      fetchUsers();
      fetchStats();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleExport = () => {
    const csv = users.map(u => `${u.name},${u.email},${u.noteCount},${u.isBanned ? 'Banned' : 'Active'}`).join('\n');
    const blob = new Blob([`Name,Email,Notes,Status\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
  };

  const sendAnnouncement = async () => {
    if (!announcement.trim()) return toast.error('Enter announcement text.');
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/announcement`, {
        message: announcement,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Announcement sent!');
      setAnnouncement('');
    } catch {
      toast.error('Failed to send announcement');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const filteredUsers = showBanned ? users : users.filter(u => !u.isBanned);

  return (
    <>
      <nav className="w-full backdrop-blur bg-white/80 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
            <img
              src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
              alt="Notepadle"
              className="w-10 h-10 object-cover rounded-md shadow"
            />
            <h1 style={{ fontFamily: `'Playfair Display', serif` }} className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text">
              Notepadle Admin
            </h1>
          </div>
          <div className='flex justify-around space-x-4'>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/admin/change-password')}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition"
              >
                <Lock className="inline-block mr-2" size={16} /> {t('admin.dashboard.change_password')}
              </motion.button>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  localStorage.removeItem('adminToken')
                  navigate('/admin/login')
                }}
                className="px-2 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition"
              >
               <LogOut className="inline-block mr-2" size={16} /> {t('admin.dashboard.logout')}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <Toaster position="top-center" />

        {/* Announcements */}
        <div className="max-w-4xl mx-auto mb-6 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-3 text-gray-800">{t('admin.dashboard.announcements.title')}</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Write announcement..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
            <button
              onClick={sendAnnouncement}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition shadow"
            >
              <Megaphone size={18} className="inline-block mr-2" />
             {t('admin.dashboard.announcements.button')}
            </button>
          </div>
        </div>

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-6xl mx-auto"
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-bold mb-4 text-gray-800">{t('admin.dashboard.stats.user_distribution')}</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: t('admin.dashboard.stats.status.active'), value: stats.activeUsers },
                      { name: t('admin.dashboard.stats.status.pending'), value: stats.pendingUsers },
                      { name: t('admin.dashboard.stats.status.banned'), value: stats.bannedUsers },
                    ]}
                    cx="50%" cy="50%" outerRadius={70}
                    dataKey="value" label
                  >
                    {pieColors.map((color, i) => (
                      <Cell key={`cell-${i}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
                 <p className="mt-4 text-sm text-gray-600 font-semibold">{t('admin.dashboard.stats.total_users')}: {stats.totalUsers}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
               <h2 className="text-lg font-bold mb-4 text-gray-800">{t('admin.dashboard.stats.notes_distribution')}</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                   data={[
                      { name: t('admin.dashboard.stats.notes.private'), value: stats.privateNotes },
                      { name: t('admin.dashboard.stats.notes.shared'), value: stats.sharedNotes },
                      {
                        name: t('admin.dashboard.stats.notes.public'),
                        value: stats.totalNotes - stats.privateNotes - stats.sharedNotes,
                      },
                    ]}
                    cx="50%" cy="50%" outerRadius={70}
                    dataKey="value" label
                  >
                    {pieColors.map((color, i) => (
                      <Cell key={`note-${i}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
             <h2 className="text-lg font-bold mb-4 text-gray-800">{t('admin.dashboard.stats.notes_per_month')}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.notesPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Users Registered Per Month</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.usersPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#f43f5e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8"
        >
          {/* Header section with title and controls */}
          <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.dashboard.users.title')}</h1>

            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showBanned}
                  onChange={() => setShowBanned(!showBanned)}
                  className="accent-indigo-600"
                />
               {t('admin.dashboard.users.show_banned')}
              </label>

              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
              >
                <Download size={16} className="inline-block mr-2" />
              {t('admin.dashboard.users.export_csv')}
              </button>
            </div>
          </div>

          {/* Table section */}
          <div className="overflow-x-auto min-h-[60vh]">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-indigo-600 text-white">
                <tr>
                    <th className="px-4 py-3 text-left">{t('admin.dashboard.users.table_headers.name')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.dashboard.users.table_headers.email')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.dashboard.users.table_headers.notes')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.dashboard.users.table_headers.status')}</th>
                  <th className="px-4 py-3 text-center">{t('admin.dashboard.users.table_headers.action')}</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.noteCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isBanned
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                          }`}
                      >
                        {u.isBanned ? t('admin.dashboard.users.status.banned') : t('admin.dashboard.users.status.active')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleBan(u._id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium shadow hover:shadow-md transition duration-300 ${u.isBanned
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                      >
                         {u.isBanned ? t('admin.dashboard.users.actions.unban') : t('admin.dashboard.users.actions.ban')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
        <Footer />
    </>
  );
}
