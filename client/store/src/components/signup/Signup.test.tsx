import "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, screen, render} from "@testing-library/react";
import { describe, vi, it, expect } from "vitest";
import Signup from "./Signup";


describe("Sign up form",()=>{

    it("checking for errors",()=>{
        const mockSignup = vi.fn();
        render(<MemoryRouter>
                <Signup onSignUp={mockSignup}/>
                </MemoryRouter>)

        const submitButton = screen.getByRole('button',{name: /sign up/i})
        fireEvent.click(submitButton);

        expect(screen.getByText(/please fill in all the fields/i)).toBeInTheDocument();
        expect(mockSignup).not.toHaveBeenCalled()

    })

    it("Testing sign up form",()=>{
        const mockSignup = vi.fn();

        render(
            <MemoryRouter>
        <Signup onSignUp={mockSignup}/>
        </MemoryRouter>
    );

        const username = screen.getByPlaceholderText(/enter username/i);
        fireEvent.change(username, {target:{value: 'Noam'}})

        fireEvent.change(screen.getByPlaceholderText(/enter surname/i), {
            target: { value: "Cohen" },
          });

        const email = screen.getByPlaceholderText(/enter valid email example@mail.com/i);
        fireEvent.change(email, {target:{value: 'Noam@mail.com'}})

        const password = screen.getByPlaceholderText(/Enter valid password/i)
        fireEvent.change(password, {target:{value: 'Noam123'}})

        const verifyPassword = screen.getByPlaceholderText(/Verify password/i)
        fireEvent.change(verifyPassword, {target:{value: 'Noam123'}})

        const submitButton = screen.getByRole('button',{name: /sign up/i})
        fireEvent.click(submitButton);

        expect(mockSignup).toHaveBeenCalledWith(
            "Noam",
      "Cohen",
      "Noam@mail.com",
      "Noam123",
      "Noam123")
    
        
    })
})