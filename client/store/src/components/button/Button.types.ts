import type React from "react";


export interface buttonProps {
    type?: 'button'| 'submit'
    onClick?: ()=> void;
    children:React.ReactNode;
    disabled?: boolean;
    className?: string;
}