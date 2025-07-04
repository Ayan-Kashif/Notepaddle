import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import { ArrowLeft } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated and has admin privileges
  // In a real app, you'd check user roles from the database
  const isAdmin = isAuthenticated && user?.email === 'admin@notepadle.com';

  const handleGoHome = () => {
    window.location.hash = '';
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to access the admin dashboard. Please sign in with an administrator account.
          </p>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Insufficient Privileges
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Only users with email <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">admin@notepadle.com</code> can access this area.
          </p>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminRoute;