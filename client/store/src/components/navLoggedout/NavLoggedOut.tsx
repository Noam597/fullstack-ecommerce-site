import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavLoggedOut: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white p-4 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold">Logo</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10">
          <NavItem to="/login" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/products" label="Products" />
          <NavItem to="/signup" label="Sign Up" />
        </ul>

        {/* Hamburger Button */}
        <button
          className="md:hidden relative w-8 h-6"
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <ul className="mt-4 space-y-4 text-center">
          <MobileNavItem to="/login" label="Home" close={() => setIsOpen(false)} />
          <MobileNavItem to="/about" label="About" close={() => setIsOpen(false)} />
          <MobileNavItem to="/products" label="Products" close={() => setIsOpen(false)} />
          <MobileNavItem to="/signup" label="Sign Up" close={() => setIsOpen(false)} />
        </ul>
      </div>
    </nav>
  );
};

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
      className="block py-2 hover:text-gray-300 transition"
      to={to}
      onClick={close}
    >
      {label}
    </Link>
  </li>
);

export default NavLoggedOut;
