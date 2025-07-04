





import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'success' || status === 'error') return;

        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('❌ No token provided.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage('✅ Email verified successfully! Redirecting to login...');

                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.message || '❌ Verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('❌ Network error. Please try again.');
            }
        };

        verifyEmail();
    }, [searchParams, status, navigate]);

    const getEmoji = () => {
        if (status === 'verifying') return '⏳';
        if (status === 'success') return '✅';
        return '❌';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
            {/* ✅ Navbar */}
            <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">

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
                <button
                    onClick={() => {
                        navigate('/')
                        window.location.reload()
                    }
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Home
                </button>
            </nav>

            {/* ✅ Content */}
            <div className="flex-grow flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
                >
                    <div className="text-5xl mb-4">{getEmoji()}</div>
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">
                        {status === 'verifying' && 'Verifying...'}
                        {status === 'success' && 'Success!'}
                        {status === 'error' && 'Verification Failed'}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">{message}</p>

                    <button
                        onClick={() => {
                            navigate('/')
                            window.location.reload()
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md"
                    >
                        Go to Home
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;
