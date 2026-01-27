import NavLoggedIn from "./NavLoggedIn";
import '@testing-library/react';
import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "../../redux/test-utils/renderWithProviders";


 const mockNavigate = vi.fn();
 const mockSetUser = vi.fn()


vi.mock('../../axios', () => ({
  api: {
    post: vi.fn(() => Promise.resolve({})),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock("../../contexts/UserContexts",()=>({
  useUser: () => ({
    setUser: mockSetUser,
  }),
}))
 
describe(" Logged In Navbar",()=>{
    it("navbar list", ()=>{
      renderWithProviders(<NavLoggedIn/>)

            expect(screen.getByRole("link", {name:/profile/i})).toHaveAttribute("href", "/dashboard");
            expect(screen.getByRole("link", {name:/shop/i})).toHaveAttribute("href", "/shop");
            expect(screen.getByRole("link", {name:/🛒/i})).toHaveAttribute("href", "/cart");
    })

    it("logout button triggers user reset and navigation", async () => {

     renderWithProviders(<NavLoggedIn/>)
        const logoutBtn = screen.getByRole("button", { name: /logout/i });
        logoutBtn.click();
    
        await waitFor(() => {
          expect(mockSetUser).toHaveBeenCalledWith(null);
          expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
      });
})