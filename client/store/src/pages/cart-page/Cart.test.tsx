import { vi } from 'vitest';
import { makeMockAsyncThunk } from '../../redux/test-utils/mockAsyncThunk';
vi.mock('../../redux/cart/cartThunks', () => ({
    fetchCartAsync: makeMockAsyncThunk('cart/fetchCartAsync'),
    addToCartAsync: makeMockAsyncThunk('cart/addToCartAsync'),
    decrementQuantityAsync: makeMockAsyncThunk('cart/decrementQuantityAsync'),
    removeCartItemAsync: makeMockAsyncThunk('cart/removeCartItemAsync'),
  }));

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../../redux/test-utils/test-store';
import { renderWithProviders } from '../../redux/test-utils/renderWithProviders';
import { useUser } from '../../contexts/UserContexts';
import Cart from './Cart';
import type { CartItem } from '../../redux/cart/types';
import * as cartThunks from '../../redux/cart/cartThunks';


// --- Mock components ---

// ---------- Mock the entire cartThunks module ----------

vi.mock('../../components/productCard/ProductCard', () => ({
  default: ({ name, onIncreaseQty, onDecreaseQty, onRemoveFromCart }: any) => (
    <div>
      <span>{name}</span>
      <button onClick={onIncreaseQty}>+</button>
      <button onClick={onDecreaseQty}>-</button>
      <button onClick={onRemoveFromCart}>Remove</button>
    </div>
  ),
}));

vi.mock('../../components/button/Button', () => ({
  default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../../contexts/UserContexts', () => ({
  useUser: vi.fn(),
}));

describe('Cart Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
      
        // These now have correct AsyncThunk shape with .pending/.fulfilled/.rejected
        vi.spyOn(cartThunks, 'addToCartAsync');
        vi.spyOn(cartThunks, 'decrementQuantityAsync');
        vi.spyOn(cartThunks, 'removeCartItemAsync');
        vi.spyOn(cartThunks, 'fetchCartAsync');
      });

  it('renders empty cart message', () => {
    (useUser as any).mockReturnValue({ user: { id: 1 } });

    const store = createTestStore({
      cart: { cart_id: null, items: [], loading: false, error: null, total: 0 },
    });

    renderWithProviders(<Cart />, { store });

    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  it('dispatches addToCartAsync when clicking +', async () => {
    (useUser as any).mockReturnValue({ user: { id: 1 } });

    const cartItems: CartItem[] = [
      { id: 1, cart_id: 1, product_id: 101, quantity: 2, name: 'Product A', price: 10, img: 'img.png', description: 'Desc', subtotal: 20 },
    ];

    const store = createTestStore({
      cart: { cart_id: 1, items: cartItems, loading: false, total: 20, error: null },
    });

    renderWithProviders(<Cart />, { store });

    await waitFor(() => screen.getByText('Product A'));

    fireEvent.click(screen.getByText('+'));

    expect(cartThunks.addToCartAsync).toHaveBeenCalled();
  });

  // Similarly for decrementQuantityAsync and removeCartItemAsync
  it('dispatches decrementQuantityAsync when clicking -', async () => {
    (useUser as any).mockReturnValue({ user: { id: 1 } });
  
    const cartItems: CartItem[] = [
      {
        id: 1,
        cart_id: 1,
        product_id: 101,
        quantity: 2,
        name: 'Product A',
        price: 10,
        img: 'img.png',
        description: 'Desc',
        subtotal: 20,
      },
    ];
  
    const store = createTestStore({
      cart: { cart_id: 1, items: cartItems, loading: false, total: 20, error: null },
    });
  
    renderWithProviders(<Cart />, { store });
  
    fireEvent.click(screen.getByText('-'));
  
    expect(cartThunks.decrementQuantityAsync).toHaveBeenCalled();
  });
  
  it('dispatches removeCartItemAsync when clicking Remove', async () => {
    (useUser as any).mockReturnValue({ user: { id: 1 } });
  
    const cartItems: CartItem[] = [
      {
        id: 1,
        cart_id: 1,
        product_id: 101,
        quantity: 2,
        name: 'Product A',
        price: 10,
        img: 'img.png',
        description: 'Desc',
        subtotal: 20,
      },
    ];
  
    const store = createTestStore({
      cart: { cart_id: 1, items: cartItems, loading: false, total: 20, error: null },
    });
  
    renderWithProviders(<Cart />, { store });
  
    fireEvent.click(screen.getByText('Remove'));
  
    expect(cartThunks.removeCartItemAsync).toHaveBeenCalled();
  });
});
