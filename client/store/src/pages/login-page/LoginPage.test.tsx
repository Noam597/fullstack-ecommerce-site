import LoginPage from "./LoginPage";
import { fireEvent, screen, render, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { api } from "../../axios";

const mockSetUser = vi.fn();
const mockNavigate = vi.fn();

// Mock useUser context
vi.mock("../../contexts/UserContexts", () => ({
  useUser: () => ({
    setUser: mockSetUser,
  }),
}));

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock axios instance
vi.mock("../../axios", () => ({
  api: {
    post: vi.fn(),
  },
}));

// Mock Login component so we can click a button
vi.mock("../../components/login/Login", () => ({
  default: ({ onLogin }: any) => (
    <button onClick={() => onLogin("noam@mail.com", "NoaM123!")}>
      Mock Login
    </button>
  ),
}));

describe("LoginPage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs in successfully and navigates to /shop", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: {
        success: true,
        user: { id: 1, name: "Noam", role: "user" }, // role determines navigation
      },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /mock login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 1,
        name: "Noam",
        role: "user",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/shop");
    });
  });

  it("shows an error message when login fails", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: { success: false, message: "Server error" },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /mock login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
