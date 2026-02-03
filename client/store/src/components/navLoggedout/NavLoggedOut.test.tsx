import NavLoggedOut from './NavLoggedOut';
import '@testing-library/jest-dom';
import { screen, render, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('Logged Out Navbar', () => {
  it('shows all links after opening mobile menu', () => {
    render(
      <MemoryRouter>
        <NavLoggedOut />
      </MemoryRouter>
    );

    // Open the hamburger menu
    const toggleBtn = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(toggleBtn);

    // Scope queries to the mobile menu using data-testid or role
    const mobileMenu = screen.getByRole('menu'); // or getByTestId('mobile-menu') if you have it

    expect(within(mobileMenu).getByRole('link', { name: /home/i })).toHaveAttribute('href', '/login');
    expect(within(mobileMenu).getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    expect(within(mobileMenu).getByRole('link', { name: /products/i })).toHaveAttribute('href', '/products');
    expect(within(mobileMenu).getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup');
  });
});
