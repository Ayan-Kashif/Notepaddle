
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  let [isVerified, setIsVerified] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate()
  const sendVerificationCode = async (emailInput: string) => {
    try {
      const res = await axios.post(`${API_BASE}/send-code`, { email: emailInput });
      if (res.data.success) {
        setEmail(emailInput);
        setStatus('Code sent to your email.');
      }
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Error sending code');
    }
  };

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }
  const verifyCode = async (code: string) => {
    try {
      const res = await axios.post(`${API_BASE}/verify-code`, { email, code });
      if (res.data.success) {
        setIsVerified(true);
        setStatus('Email verified!');
      }
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Invalid code');
    }
  };

  return {
    email,
    isVerified,
    status,
    logout,
    sendVerificationCode,
    verifyCode,
  };
};
