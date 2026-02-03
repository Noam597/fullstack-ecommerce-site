import NavbarAdmin from './NavbarAdmin';
import '@testing-library/jest-dom';
import { screen, render, waitFor, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../../axios'; // <-- import your api here

// Mock api.post
vi.mock('../../axios', () => ({
  api: {
    post: vi.fn(() => Promise.resolve({})),
  },
}));

const mockNavigate = vi.fn();
const mockSetUser = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../contexts/UserContexts', () => ({
  useUser: () => ({
    setUser: mockSetUser,
  }),
}));

describe('Logged Into Admin Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows admin links in mobile menu after opening hamburger', async () => {
    render(
      <MemoryRouter>
        <NavbarAdmin />
      </MemoryRouter>
    );

    const hamburgerBtn = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(hamburgerBtn);

    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(within(mobileMenu).getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(within(mobileMenu).getByRole('link', { name: /stock/i })).toHaveAttribute('href', '/stock');
    expect(within(mobileMenu).getByRole('link', { name: /accounts/i })).toHaveAttribute('href', '/accounts');
    expect(within(mobileMenu).getByRole('link', { name: /add new/i })).toHaveAttribute('href', '/addNew');
  });

  it('logout button triggers user reset and navigation (desktop)', async () => {
    render(
      <MemoryRouter>
        <NavbarAdmin />
      </MemoryRouter>
    );

    const desktopMenu = screen.getByTestId('desktop-menu');
    const logoutBtn = within(desktopMenu).getByRole('button', { name: /logout/i });

    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/users/logout',
        {},
        { withCredentials: true }
      );
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('logout button triggers user reset and navigation (mobile)', async () => {
    render(
      <MemoryRouter>
        <NavbarAdmin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));

    const mobileMenu = screen.getByTestId('mobile-menu');
    const logoutBtn = within(mobileMenu).getByRole('button', { name: /logout/i });

    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/users/logout',
        {},
        { withCredentials: true }
      );
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
