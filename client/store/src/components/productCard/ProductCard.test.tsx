import ProductCard from "./ProductCard";
import { screen, render } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from "react-router-dom";
import { useUser } from "../../contexts/UserContexts";

vi.mock('../../contexts/UserContexts', async () => {
  const actual = await vi.importActual('../../contexts/UserContexts');
  return {
    ...actual,
    useUser: vi.fn(),
  };
});

const mockOnAdd = vi.fn();
const mockOnRemove = vi.fn();
const mockOnIncrease = vi.fn();
const mockOnDecrease = vi.fn();

describe("ProductCard", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    (useUser as any).mockReturnValue({ user: null, setUser: vi.fn() });
  });

  it("shows Login button when not logged in and not inCart", () => {
    render(
      <MemoryRouter>
        <ProductCard
          id={1}
          name="MacBook"
          description="Apple laptop"
          price={2500}
          quantity={10}
          cartQuantity={0}
          inCart={false}
          onAddToCart={mockOnAdd}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/login to add to cart/i)).toBeInTheDocument();
  });

  it("shows 'ADD TO CART' when logged in, in stock, and not inCart", () => {
    (useUser as any).mockReturnValue({ user: { id: 1, name: 'Test' }, setUser: vi.fn() });

    render(
      <MemoryRouter>
        <ProductCard
          id={2}
          name="iPad"
          description="Tablet"
          price={800}
          quantity={5}
          cartQuantity={0}
          inCart={false}
          onAddToCart={mockOnAdd}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  it("shows 'Out of stock' when logged in but quantity is 0", () => {
    (useUser as any).mockReturnValue({ user: { id: 1, name: 'Test' }, setUser: vi.fn() });

    render(
      <MemoryRouter>
        <ProductCard
          id={3}
          name="AirPods"
          description="Earphones"
          price={200}
          quantity={0}
          cartQuantity={0}
          inCart={false}
          onAddToCart={mockOnAdd}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it("renders cart controls when inCart=true", () => {
    (useUser as any).mockReturnValue({ user: { id: 1, name: 'Test' }, setUser: vi.fn() });

    render(
      <MemoryRouter>
        <ProductCard
          id={4}
          name="iPhone"
          description="Phone"
          price={1000}
          quantity={10}
          cartQuantity={2}
          inCart={true}
          inShop={false} 
          onRemoveFromCart={mockOnRemove}
          onIncreaseQty={mockOnIncrease}
          onDecreaseQty={mockOnDecrease}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByTestId("quantity").textContent).toBe("2");
  });
});