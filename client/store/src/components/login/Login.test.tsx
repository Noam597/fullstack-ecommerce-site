import Login from "./Login";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/react";
import { fireEvent, screen, render} from "@testing-library/react";
import { describe, vi, it, expect } from "vitest";

describe("Inputs and button together with Login for", ()=>{

    it("checks for errors", ()=>{
        const mockLogin = vi.fn();
        render(
            <MemoryRouter>
                <Login onLogin={mockLogin}/>
            </MemoryRouter>
    )

        const submitButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(submitButton);

        expect(screen.getByText(/must fill in email and password/i)).toBeInTheDocument();
        expect(mockLogin).not.toHaveBeenCalled();
    })

    it("calls login and password when form is submitted",()=>{
        const mockLogin = vi.fn();
        render(
            <MemoryRouter>
                <Login onLogin={mockLogin}/>
            </MemoryRouter>
    )

        const username = screen.getByPlaceholderText(/enter email/i);
        fireEvent.change(username, { target:{value:'noam@mail.com'}});

        const password = screen.getByPlaceholderText(/enter password/i);
        fireEvent.change(password, { target:{value:'NoaM123!'}});

        const button = screen.getByRole("button", { name: /login/i });
         fireEvent.click(button);

        expect(mockLogin).toHaveBeenCalledWith('noam@mail.com', 'NoaM123!')
    })
})