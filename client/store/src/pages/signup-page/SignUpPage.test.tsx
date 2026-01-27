import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import SignUpPage from "./SignUpPage";
import { api } from "../../axios";

const mockNavigate = vi.fn();

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Signup component
vi.mock("../../components/signup/Signup", () => ({
  default: ({ onSignUp }: any) => (
    <button
      onClick={() =>
        onSignUp("John", "Doe", "john@example.com", "123456", "123456")
      }
    >
      Sign Up
    </button>
  ),
}));

// Mock api instance
vi.mock("../../axios", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls api.post and navigates on successful signup", async () => {
    (api.post as any).mockResolvedValueOnce({ data: { success: true } });

    render(<SignUpPage />);

    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/users/register", {
        name: "John",
        surname: "Doe",
        email: "john@example.com",
        password: "123456",
        verifyPassword: "123456",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("displays error message if signup fails", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: { success: false, message: "Email already exists" },
    });

    render(<SignUpPage />);

    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("displays server error message if request throws", async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: "Server is down" } },
    });

    render(<SignUpPage />);

    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => {
      expect(screen.getByText(/Server is down/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
