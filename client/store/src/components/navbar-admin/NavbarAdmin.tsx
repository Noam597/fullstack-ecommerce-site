import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import { useUser } from '../../contexts/UserContexts';
import { api } from '../../axios';

const NavbarAdmin: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logOut = async () => {
    await api.post(
      '/users/logout',
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white p-4 z-50">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      {/* Logo */}
      <div className="text-lg font-bold">Logo</div>
  
      {/* Desktop Menu */}
      <ul 
      data-testid="desktop-menu"
      className="hidden md:flex space-x-7 items-center">
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/stock" label="Stock" />
        <NavItem to="/accounts" label="Accounts" />
        <NavItem to="/addNew" label="Add New" />
        <li>
          <Button onClick={logOut} type="button">
            Logout
          </Button>
        </li>
      </ul>
  
      {/* Hamburger */}
      <button
        className="md:hidden relative w-8 h-6 shrink-0"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`absolute h-0.5 w-8 bg-white transition-all duration-300
            ${isOpen ? 'rotate-45 top-3' : 'top-0'}`}
        />
        <span
          className={`absolute h-0.5 w-8 bg-white top-3 transition-all duration-300
            ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        />
        <span
          className={`absolute h-0.5 w-8 bg-white transition-all duration-300
            ${isOpen ? '-rotate-45 top-3' : 'top-6'}`}
        />
      </button>
    </div>
  
    {/* Mobile Dropdown */}
    <div
    data-testid="mobile-menu"
    role="menu"
    aria-label="Mobile menu"
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <ul className="mt-4 space-y-4 text-center">
        <MobileNavItem to="/dashboard" label="Dashboard" close={() => setIsOpen(false)} />
        <MobileNavItem to="/stock" label="Stock" close={() => setIsOpen(false)} />
        <MobileNavItem to="/accounts" label="Accounts" close={() => setIsOpen(false)} />
        <MobileNavItem to="/addNew" label="Add New" close={() => setIsOpen(false)} />
        <li>
          <Button
            onClick={() => {
              setIsOpen(false);
              logOut();
            }}
            type="button"
          >
            Logout
          </Button>
        </li>
      </ul>
    </div>
  </nav>
  
  );
};

/* ---------- Helpers ---------- */

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link className="hover:text-gray-300 transition" to={to}>
      {label}
    </Link>
  </li>
);

const MobileNavItem = ({
  to,
  label,
  close,
}: {
  to: string;
  label: string;
  close: () => void;
}) => (
  <li>
    <Link
      to={to}
      onClick={close}
      className="block py-2 hover:text-gray-300 transition"
    >
      {label}
    </Link>
  </li>
);

export default NavbarAdmin;
