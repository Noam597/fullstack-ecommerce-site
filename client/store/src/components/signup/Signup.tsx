import React, { useState } from 'react';
import Inputs from '../inputs/Inputs';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import type { signUpProps } from './Signup.types';

function Signup({ onSignUp }: signUpProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !surname || !email || !password || !verifyPassword) {
      setLocalError('Please fill in all the fields');
      return;
    }

    if (password !== verifyPassword) {
      setLocalError("Passwords don't match");
      return;
    }

    onSignUp(name, surname, email, password, verifyPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <Inputs
        label="Username"
        name="username"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter username"
        className="w-full"
      />
      <Inputs
        label="Surname"
        name="surname"
        type="text"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        placeholder="Enter surname"
        className="w-full"
      />
      <Inputs
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@mail.com"
        className="w-full"
      />
      <Inputs
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter valid password"
        className="w-full"
      />
      <Inputs
        label="Verify Password"
        name="verifyPassword"
        type="password"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
        placeholder="Verify password"
        className="w-full"
      />

      <div className="w-full flex justify-center mt-4">
        <Button type="submit" className="w-full sm:w-auto">
          Sign Up
        </Button>
      </div>

      {localError && <p className="text-red-500 mt-2">{localError}</p>}

      <p className="text-sm mt-4 text-gray-300">
        Already have an account?{' '}
        <Link to="/login" className="underline hover:text-white">
          Log in here
        </Link>
      </p>
    </form>
  );
}

export default Signup;
