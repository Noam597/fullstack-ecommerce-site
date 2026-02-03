import React, { useState } from 'react';
import Signup from '../../components/signup/Signup';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axios';

const SignUpPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSignUp = async (
    name: string,
    surname: string,
    email: string,
    password: string,
    verifyPassword: string
  ) => {
    try {
      const response = await api.post('/users/register', {
        name,
        surname,
        email,
        password,
        verifyPassword,
      });

      if (response.data.success) {
        navigate('/home');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-black rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg">
        <Signup onSignUp={handleSignUp} />
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
