import { render ,screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { useUser } from '../../contexts/UserContexts';
import Navbar from './Navbar';

vi.mock('../../components/navLoggedout/NavLoggedOut', () => ({
    default: () => <nav data-testid="nav-logged-out">Logged Out Nav</nav>,
  }));
  vi.mock('../../components/navloggeIn/NavLoggedIn', () => ({
    default: () => <nav data-testid="nav-logged-in">Logged In Nav</nav>,
  }));
  vi.mock('../../components/navbar-admin/NavbarAdmin', () => ({
    default: () => <nav data-testid="nav-admin">Admin Nav</nav>,
  }));
// Mock useUser from context
vi.mock('../../contexts/UserContexts', () => ({
  useUser: vi.fn()
}));

describe('Navbar', () => {
    it('renders NavLoggedOut if no user', () => {
      (useUser as any).mockReturnValue({ user: null });
  
      render(<Navbar />);
  
      expect(screen.getByTestId('nav-logged-out')).toBeInTheDocument();
      expect(screen.queryByTestId('nav-logged-in')).not.toBeInTheDocument();
      expect(screen.queryByTestId('nav-admin')).not.toBeInTheDocument();
    });
  
    it('renders NavLoggedIn if user is not admin', () => {
      (useUser as any).mockReturnValue({ user: { id: 1, role: 'user' } });
  
      render(<Navbar />);
  
      expect(screen.getByTestId('nav-logged-in')).toBeInTheDocument();
      expect(screen.queryByTestId('nav-logged-out')).not.toBeInTheDocument();
      expect(screen.queryByTestId('nav-admin')).not.toBeInTheDocument();
    });
  
    it('renders NavbarAdmin if user is admin', () => {
      (useUser as any).mockReturnValue({ user: { id: 1, role: 'admin' } });
  
      render(<Navbar />);
  
      expect(screen.getByTestId('nav-admin')).toBeInTheDocument();
      expect(screen.queryByTestId('nav-logged-in')).not.toBeInTheDocument();
      expect(screen.queryByTestId('nav-logged-out')).not.toBeInTheDocument();
    });
  });
  
