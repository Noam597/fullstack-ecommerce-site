
import { screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import HomePage from './HomePage';

// Mock useUser from context
vi.mock('../../contexts/UserContexts', () => ({
  useUser: vi.fn()
}));

vi.mock('../../redux/orders/ordersThunks', async () => {
  const actual = await vi.importActual<
    typeof import('../../redux/orders/ordersThunks')
  >('../../redux/orders/ordersThunks');

  const mockThunk: any = vi.fn(() => ({
    type: 'orders/fetchOrdersAsync'
  }));

  mockThunk.pending = { type: 'orders/fetchOrdersAsync/pending' };
  mockThunk.fulfilled = { type: 'orders/fetchOrdersAsync/fulfilled' };
  mockThunk.rejected = { type: 'orders/fetchOrdersAsync/rejected' };

  return {
    ...actual,
    fetchOrdersAsync: mockThunk
  };
});

import { useUser } from '../../contexts/UserContexts';
import { renderWithProviders } from '../../redux/test-utils/renderWithProviders';

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login if username is not present', () => {
    (useUser as unknown as Mock).mockReturnValue({ user: null });


    renderWithProviders(<HomePage />)
    
    expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
  });

  it('renders welcome message and dashboard info when username is present', () => {
    (useUser as Mock).mockReturnValue({
      user: { id: 1, name: 'JaneDoe', surname: 'PunkAss', email: 'jane@test.com' }
    });

   
    renderWithProviders(<HomePage />)

    expect(screen.getByRole("heading", {
      name: /welcome janedoe punkass!/i
    })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /purchase history/i })).toBeInTheDocument();
  });

  });

