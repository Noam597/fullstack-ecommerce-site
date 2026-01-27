import React from 'react'
import type {InputProps } from './Inputs.types'
const Inputs:React.FC<InputProps> = ({label,name, type, placeholder ,value, onChange,readonly=false, className=''}) => {
  return (
    <div className='flex flex-col items-center p-1 my-3'>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
    <input className={`text-white text-center bg-gray-900 border-b-2 border-b-blue-200  rounded-md ${className}`} 
    name={name} 
    type={type} 
    value={value} 
    onChange={onChange} 
    placeholder={placeholder}
    readOnly={readonly}
    />
    
    </div>
  )
}

export default Inputs