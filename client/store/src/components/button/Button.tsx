// import React from 'react'
import type { buttonProps } from './Button.types'

function Button({children,onClick,type = 'button',disabled=false, className=''}: buttonProps) {
  return (
    <button className={`cursor-pointer ${className} mx-auto px-2 text-white text-center bg-black border-solid border-2 border-white rounded-md transform transition hover:text-black hover:bg-white active:bg-fuchsia-800`}  
    onClick={onClick} 
    type={type} disabled={disabled}>
      {children}
      </button >
  )
}



export default Button
