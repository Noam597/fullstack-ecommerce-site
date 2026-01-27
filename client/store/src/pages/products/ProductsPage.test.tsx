import { describe, it, vi, beforeEach, expect } from 'vitest';
import { renderWithProviders } from '../../redux/test-utils/renderWithProviders';
import { createTestStore } from '../../redux/test-utils/test-store';
import ProductsPage from './ProductsPage';
import { fetchProducts } from '../../redux/products/productSlice';
import { screen, fireEvent, waitFor } from '@testing-library/react';

// Mock ProductCard and Inputs
vi.mock('../../components/productCard/ProductCard', () => ({
  default: ({ name }: any) => <div data-testid="product-card">{name}</div>,
}));

vi.mock('../../components/inputs/Inputs', () => ({
  default: ({ value, onChange }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
    />
  ),
}));

vi.mock('../../components/loading-spinner/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));
vi.mock('../../redux/products/productSlice', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../redux/products/productSlice')>();
    return {
      ...actual,          // keep default export (productReducer)
      fetchProducts: vi.fn(() => ({ type: 'products/fetch' }))  // only mock the thunk
    };
  });


describe('ProductsPage', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createTestStore({
      products: {
        product_id: 1,
        products: [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                description: "Noise-cancelling over-ear headphones with 30-hour battery life.",
                img: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFdpcmVsZXNzJTIwQmx1ZXRvb3RoJTIwSGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
                price: 89.99,
                quantity: 46,
                category: "Audio"
              },
              {
                id: 2,
                name: "Mechanical Gaming Keyboard",
                description: "RGB backlit mechanical keyboard with blue switches.",
                img: "https://plus.unsplash.com/premium_photo-1664194583917-b0ba07c4ce2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TWVjaGFuaWNhbCUyMEdhbWluZyUyMEtleWJvYXJkfGVufDB8fDB8fHww",
                price: 59.99,
                quantity: 50,
                category: "Computers"
              },
        ],
        status: 'idle',
      },
    });
  });

  it('dispatches fetchProducts on mount', () => {
    renderWithProviders(<ProductsPage />, { store });
    expect(fetchProducts).toHaveBeenCalled();
  });

  it('renders loading spinner when loading', () => {
    store = createTestStore({
      products: {product_id: 1, products: [], status: 'loading' },
    });

    renderWithProviders(<ProductsPage />, { store });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders product cards', () => {
    renderWithProviders(<ProductsPage />, { store });
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    expect(screen.getByText("Wireless Bluetooth Headphones")).toBeInTheDocument();
    expect(screen.getByText("Mechanical Gaming Keyboard")).toBeInTheDocument();
  });

  it('filters products based on search input', async () => {
    renderWithProviders(<ProductsPage />, { store });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: "Wireless Bluetooth Headphones" } });

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1);
      expect(screen.getByText("Wireless Bluetooth Headphones")).toBeInTheDocument();
    });
  });
});
