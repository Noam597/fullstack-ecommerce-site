import NavbarAdmin from './NavbarAdmin';
import '@testing-library/react';
import { screen, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import axios from 'axios';


vi.mock('axios')
const mockNavigate = vi.fn();
const mockSetUser = vi.fn()

vi.mock("react-router-dom", async ()=>{
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate:() => mockNavigate,
    }
})


vi.mock('../../contexts/UserContexts', () => ({
    useUser: () => ({
      setUser: mockSetUser,
    }),
  }))
describe(" Logged Into Admin Navbar",()=>{
    it("navbar list", ()=>{
        render(<MemoryRouter>
                    <NavbarAdmin/>
               </MemoryRouter>)

            expect(screen.getByRole("link", {name:/dashboard/i})).toHaveAttribute("href", "/dashboard");
            expect(screen.getByRole("link", {name:/stock/i})).toHaveAttribute("href", "/stock");
            expect(screen.getByRole("link", {name:/accounts/i})).toHaveAttribute("href", "/accounts");
            expect(screen.getByRole("link", {name:/add New/i})).toHaveAttribute("href", "/addNew");
    })      

    it("logout button triggers token reset and navigation", async () => {
        render(
          <MemoryRouter>
            <NavbarAdmin />
          </MemoryRouter>
        );
    
        const logoutBtn = screen.getByRole("button", { name: /logout/i });
        logoutBtn.click();
        
        
    await waitFor(() => {
         expect(axios.post).toHaveBeenCalledWith(
      "/users/logout",
      {},
      { withCredentials: true }
    )

        expect(mockSetUser).toHaveBeenCalledWith(null);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
})
})