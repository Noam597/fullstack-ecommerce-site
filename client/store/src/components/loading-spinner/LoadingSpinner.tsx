import React from 'react'

const LoadingSpinner:React.FC = () => {
  return (
    // <div className="w-12 h-12 border-4 border-solid border-t-blue-400 border-b-blue-400 border-transparent rounded-full animate-spin"/>
    <div className="flex items-center justify-center w-full h-full">
  <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-solid border-t-blue-400 border-b-blue-400 border-transparent rounded-full animate-spin" />
</div>
  )
}

export default LoadingSpinner