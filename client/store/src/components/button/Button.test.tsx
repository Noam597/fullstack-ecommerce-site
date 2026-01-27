import Button from "./Button";
import "@testing-library/react";
import { fireEvent, screen, render} from "@testing-library/react";
import { describe, vi, it, expect } from "vitest";

describe("Button", ()=>{
    it("button click",()=>{
        const buttonClick = vi.fn();

        render(<Button onClick={buttonClick}>Click</Button>)

        const button = screen.getByText(/click/i) 
        expect(button)
        
        fireEvent.click(button)
        expect(buttonClick).toHaveBeenCalledTimes(1)
    })
})