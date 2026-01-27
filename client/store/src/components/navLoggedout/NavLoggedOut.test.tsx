import NavLoggedOut from './NavLoggedOut';
import '@testing-library/react';
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";


 const mockNavigate = vi.fn();


vi.mock("react-router-dom", async ()=>{
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate:() => mockNavigate,
    }
})

describe("testing all links",()=>{
    it("testing each link in the list",()=>{
        render(<MemoryRouter>
                <NavLoggedOut/>
            </MemoryRouter>)


expect(screen.getByRole("link", {name:/home/i})).toHaveAttribute("href", "/login");
expect(screen.getByRole("link", {name:/about/i})).toHaveAttribute("href", "/about");
expect(screen.getByRole("link", {name:/products/i})).toHaveAttribute("href", "/products");
expect(screen.getByRole("link", {name:/sign up/i})).toHaveAttribute("href", "/signup");

            
    })
})
