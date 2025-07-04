import React, { useState, useEffect } from 'react';
import { X, Mail, Clock, CheckCircle, RefreshCw } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [countdown, setCountdown] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // API call to resend
  const handleResend = async () => {
    try {
      setIsResending(true);
      const res = await fetch('http://localhost:5000/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsResending(false);

      if (data.success) {
        setMessage({ type: 'success', text: 'Verification code resent to your email.' });
        setCountdown(30); // 30 seconds cooldown
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to resend code.' });
      }
    } catch (error) {
      setIsResending(false);
      setMessage({ type: 'error', text: 'Network error. Try again.' });
    }
  };

  // API call to verify
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) return;

    try {
      setIsVerifying(true);
      const res = await fetch('http://localhost:5000/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await res.json();
      setIsVerifying(false);

      if (data.success) {
        setMessage({ type: 'success', text: 'Email verified successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Verification failed.' });
      }
    } catch (error) {
      setIsVerifying(false);
      setMessage({ type: 'error', text: 'Network error. Try again.' });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check your inbox for the verification code
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

        {/* Content */}
        <div className="p-6">
          {/* Info box */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Verification Email Sent
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  We've sent a verification code to <strong>{email}</strong> from <strong>support@notepadle.com</strong>.
                  Please check your inbox and enter the code below.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200 text-center text-lg font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`p-3 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                }`}
              >
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  {message.text}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="inline-flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          {/* Demo note */}
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Demo Mode:</strong> For testing, the verification code is <strong>123456</strong>.
                  In production, the email is sent from <strong>support@notepadle.com</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
