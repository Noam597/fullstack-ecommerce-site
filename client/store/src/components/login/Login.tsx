import React, { useState } from 'react';
import type { loginProps } from './Login.types';
import Inputs from '../inputs/Inputs';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

function Login({ onLogin }: loginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Must fill in email and password');
      return;
    }

    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
      <Inputs
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email"
        className="w-full"
      />

      <Inputs
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="w-full"
      />

      <div className="w-full flex justify-center mt-4">
        <Button type="submit" className="w-full sm:w-auto">
          Login
        </Button>
      </div>

      {localError && <p className="text-red-500 mt-2">{localError}</p>}

      <p className="text-sm mt-4 text-gray-300">
        Not registered yet?{' '}
        <Link to="/signup" className="underline hover:text-white">
          Sign up here
        </Link>
      </p>
    </form>
  );
}

export default Login;
