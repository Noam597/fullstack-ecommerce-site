import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContexts';
import Login from '../../components/login/Login';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axios';

const LoginPage: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post(
        '/users/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);

        if (response.data.user.role === 'admin') {
          navigate('/stock');
        } else {
          navigate('/shop');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-black rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg">
        <Login onLogin={handleLogin} />
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
