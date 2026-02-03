import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import { useUser } from '../../contexts/UserContexts';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../redux/store';
import { fetchCartAsync } from '../../redux/cart/cartThunks';
import { api } from '../../axios';

const NavLoggedIn: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartAsync({ customerId: user.id }));
    }
  }, [dispatch, user?.id]);

  const logOut = async () => {
    try {
      await api.post('/users/logout', {}, { withCredentials: true });
    } catch (err: any) {
      console.log(err.message);
    }
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white p-4 z-50">
      <div className="flex justify-between items-center">
        {/* Logo + User */}
        <div>
          <div className="font-bold">Logo</div>
          <Link
            to="/dashboard"
            className="text-sm hover:text-gray-300 transition"
          >
            {user?.name} {user?.surname}
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul 
        data-testid="desktop-menu"
        className="hidden md:flex space-x-7 items-center">
          <NavItem to="/dashboard" label="Profile" />
          <NavItem to="/shop" label="Shop" />
          <CartItem count={cart.length} />
          <li>
            <Button onClick={logOut} type="button">
              Logout
            </Button>
          </li>
        </ul>

        {/* Hamburger */}
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <ul className="mt-4 space-y-4 text-center">
          <MobileNavItem to="/dashboard" label="Profile" close={() => setIsOpen(false)} />
          <MobileNavItem to="/shop" label="Shop" close={() => setIsOpen(false)} />

          <li>
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="relative inline-block hover:text-gray-300 transition"
            >
              🛒 Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-4 text-xs bg-blue-400 bg-opacity-80 px-2 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </li>

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

const CartItem = ({ count }: { count: number }) => (
  <li>
    <Link to="/cart" className="relative hover:text-gray-300 transition">
      🛒
      {count > 0 && (
        <span className="absolute -top-2 -right-3 text-xs bg-blue-400 bg-opacity-80 px-2 rounded-full">
          {count}
        </span>
      )}
    </Link>
  </li>
);

export default NavLoggedIn;
