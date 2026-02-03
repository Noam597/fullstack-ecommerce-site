// CheckOut.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { createTestStore } from '../../redux/test-utils/test-store';
import { renderWithProviders } from '../../redux/test-utils/renderWithProviders';
import { useUser } from '../../contexts/UserContexts';

import type { CartItem } from '../../redux/cart/types';


vi.mock('../../contexts/UserContexts', () => ({
  useUser: vi.fn(),
}));
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual: any = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    };
  });
import CheckOut from './CheckOut';

describe('CheckOut Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /cart if user is not logged in', () => {
    (useUser as any).mockReturnValue({ user: null });

    const store = createTestStore({ cart: {  cart_id: 1, items: [], loading: false, total: 0, error: null} });

    renderWithProviders(<CheckOut />, { store });

    expect(screen.queryByText(/Back to Cart/i)).not.toBeInTheDocument();
  });

  it('renders empty cart message if cart has no items', () => {
    (useUser as any).mockReturnValue({ user: { id: 1 } });

    const store = createTestStore({ cart: {  cart_id: 1, items: [], loading: false, total: 0, error: null} });

    renderWithProviders(<CheckOut />, { store });

    expect(screen.getByText(/Cart is Empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Cart/i)).toBeInTheDocument();
  });

  it('renders cart table if cart has items', () => {
    (useUser as any).mockReturnValue({ user: { id: 1 } });

    const cartItems : CartItem[]= [
      {
        id: 1,
        cart_id: 1,
        product_id: 101,
        name: 'Product A',
        price:10,
        description: 'Desc',
        img: 'img.png',
        quantity: 2,
        subtotal: 20,
      },
      {
        id: 2,
        cart_id: 1,
        product_id: 102,
        name: 'Product B',
        price:7.5,
        description: 'Desc2',
        img: 'img2.png',
        quantity: 1,
        subtotal: 15,
      },
    ];

    const store = createTestStore({ cart: { cart_id:1, items: cartItems, loading: false, total: 35, error: null } });

    renderWithProviders(<CheckOut />, { store });

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toHaveTextContent('TOTAL: 35.00$');
    expect(screen.getByText(/Payment/i)).toBeEnabled();
  });

  it('calls navigate when Back to Cart button is clicked', () => {
    
    (useUser as any).mockReturnValue({ user: { id: 1 } });

    const store = createTestStore({ cart: {  cart_id: 1, items: [], loading: false, total: 0, error: null}});

    renderWithProviders(<CheckOut />, { store });

    fireEvent.click(screen.getByText(/Back to Cart/i));

    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  it('disables Payment button when cart is empty', () => {
    (useUser as any).mockReturnValue({ user: { id: 1 } });

    const store = createTestStore({ cart: {  cart_id: 1, items: [], loading: false, total: 0, error: null}});

    renderWithProviders(<CheckOut />, { store });

    const paymentButtons = screen.queryAllByText(/Payment/i);
    expect(paymentButtons).toHaveLength(0);
  });
});
