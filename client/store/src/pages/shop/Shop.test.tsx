import {  screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { makeMockAsyncThunk } from '../../redux/test-utils/mockAsyncThunk';
import { addToCartAsync } from '../../redux/cart/cartThunks';
import { createTestStore } from '../../redux/test-utils/test-store';
// ✅ ALL vi.mock calls go FIRST
vi.mock('../../redux/cart/cartThunks', () => ({
  fetchCartAsync: makeMockAsyncThunk('cart/fetchCart'),
  addToCartAsync: makeMockAsyncThunk('cart/addToCart'),
  decrementQuantityAsync: makeMockAsyncThunk('cart/decrementQuantity'),
}));

vi.mock('../../contexts/UserContexts', () => ({
  useUser: vi.fn(),
}));

vi.mock('../../components/pagination/Pagination', () => ({
  default: ({ children, items }: any) => children(items),
}));

vi.mock('../../components/loading-spinner/LoadingSpinner', () => ({
  default: () => <div>Loading...</div>,
}));
import Shop from './Shop';
import { renderWithProviders } from '../../redux/test-utils/renderWithProviders';
import { useUser } from '../../contexts/UserContexts';


  vi.mock('../../redux/products/productSlice', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../redux/products/productSlice')>();
    return {
      ...actual,          // keep default export (productReducer)
      fetchProducts: vi.fn(() => ({ type: 'products/fetch' }))  // only mock the thunk
    };
  });

  vi.mock('../../components/pagination/Pagination', () => ({
    default: ({ children, items }: any) => children(items)
  }));

  vi.mock('../../components/loading-spinner/LoadingSpinner', () => ({
    default: () => <div>Loading...</div>
  }));

  const mockProducts = [
    {
      id: 1,
      name: 'Product A',
      description: 'Desc',
      price: 10,
      quantity: 5,
      img: 'img.png',
      category: 'test'
    }
  ];
  describe('Shop', () => {
    it('shows spinner while loading', () => {
      (useUser as any).mockReturnValue({
        user: null,
        loadingUser: true
      });
  
      renderWithProviders(<Shop />);
  
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  
    it('renders products when loaded', () => {
      (useUser as any).mockReturnValue({
        user: { id: 1 },
        loadingUser: false
      });
      
      const store = createTestStore({
        products: {
          product_id: 1,
          products: mockProducts,
          status: 'succeeded',
          error: null,
        },
        cart: {
          cart_id: 10,
          items: [],
          loading: false,
          error: null,
          total: 0,
        },
      });
      renderWithProviders(<Shop />, { store });
      
      expect(
        screen.getByRole('heading', { name: /welcome to the shop/i })
      ).toBeInTheDocument();
  
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });
  
    it('dispatches addToCart when clicking Add', () => {
      (useUser as any).mockReturnValue({
        user: { id: 1 },
        loadingUser: false
      });
      const store = createTestStore({
        products: {
          product_id: 1,
          products: [
            {
              id: 1,
              name: "Product A",
              description: "Desc",
              price: 10,
              quantity: 5,
              img: "img.png",
              category: "test",
            },
          ],
          status: "succeeded",
          error: null,
        },
        cart: {
          cart_id: 10,
          items: [],
          loading: false,
          error: null,
          total: 0,
        },
      });
      renderWithProviders(<Shop />, {
        store
      });
  
      fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
      expect(addToCartAsync).toHaveBeenCalled();
      const actions = store.getState();
      expect(actions.cart.cart_id).toBe(10);
    });
  });