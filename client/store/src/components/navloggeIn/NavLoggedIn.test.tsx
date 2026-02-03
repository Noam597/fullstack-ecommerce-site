import NavLoggedIn from "./NavLoggedIn";
import '@testing-library/jest-dom';
import { screen, waitFor, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../redux/test-utils/renderWithProviders";
import { api } from '../../axios';

vi.mock('../../axios', () => ({
  api: {
    post: vi.fn(() => Promise.resolve({})),
  },
}));

const mockNavigate = vi.fn();
const mockSetUser = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock("../../contexts/UserContexts", () => ({
  useUser: () => ({
    setUser: mockSetUser,
  }),
}));

describe("Logged In Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows desktop links correctly", () => {
    renderWithProviders(<NavLoggedIn />);

    const desktopMenu = screen.getByTestId("desktop-menu");

    expect(within(desktopMenu).getByRole("link", { name: /profile/i }))
      .toHaveAttribute("href", "/dashboard");
    expect(within(desktopMenu).getByRole("link", { name: /shop/i }))
      .toHaveAttribute("href", "/shop");
    expect(within(desktopMenu).getByRole("link", { name: /🛒/i }))
      .toHaveAttribute("href", "/cart");
    expect(within(desktopMenu).getByRole("button", { name: /logout/i }))
      .toBeInTheDocument();
  });

  it("shows mobile links after opening hamburger menu", () => {
    renderWithProviders(<NavLoggedIn />);

    // Open mobile menu
    const hamburgerBtn = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(hamburgerBtn);

    const mobileMenu = screen.getByTestId("mobile-menu");

    expect(within(mobileMenu).getByRole("link", { name: /profile/i }))
      .toHaveAttribute("href", "/dashboard");
    expect(within(mobileMenu).getByRole("link", { name: /shop/i }))
      .toHaveAttribute("href", "/shop");
    expect(within(mobileMenu).getByRole("link", { name: /🛒/i }))
      .toHaveAttribute("href", "/cart");
    expect(within(mobileMenu).getByRole("button", { name: /logout/i }))
      .toBeInTheDocument();
  });

  it("logout button triggers user reset and navigation (desktop)", async () => {
    renderWithProviders(<NavLoggedIn />);

    const desktopMenu = screen.getByTestId("desktop-menu");
    const logoutBtn = within(desktopMenu).getByRole("button", { name: /logout/i });

    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/users/logout",
        {},
        { withCredentials: true }
      );
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("logout button triggers user reset and navigation (mobile)", async () => {
    renderWithProviders(<NavLoggedIn />);

    // Open mobile menu
    const hamburgerBtn = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(hamburgerBtn);

    const mobileMenu = screen.getByTestId("mobile-menu");
    const logoutBtn = within(mobileMenu).getByRole("button", { name: /logout/i });

    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/users/logout",
        {},
        { withCredentials: true }
      );
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
