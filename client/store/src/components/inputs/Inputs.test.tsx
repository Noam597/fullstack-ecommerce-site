// import React from "react";
import Inputs from "./Inputs";
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react'
import {describe, it, expect} from 'vitest'


describe("Input", ()=>{
    it("renders the input",()=>{
        render(<Inputs label={"Username"} name="username" placeholder={"Enter your Username"}/> )
        expect(screen.getByText(/username/i))
        const input = screen.getByPlaceholderText(/enter your username/i)
        expect(input).toBeInTheDocument()

        fireEvent.change(input,{ target:{ value:"usernameExample"}})
    })
})