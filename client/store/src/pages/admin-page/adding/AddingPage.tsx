import { useState } from 'react'
import AddNewAccount from './AddNewAccount'
import AddNewItem from './AddNewItem'

const AddingPage = () => {

  const [addAddition, setAaddAddition] = useState<boolean>(false);

  const activeClasses = 'bg-blue-300 text-blue-600';
  const inactiveClasses = 'bg-gray-200 text-black'

  return (
    <div>
    <div className='flex flex-wrap justify-center'>
      <div onClick={()=>{setAaddAddition(false)}} className={`cursor-pointer w-44 px-4 py-2 rounded ${
            !addAddition ? activeClasses : inactiveClasses
          }`}>
        Add A New Item
        </div>
      <div onClick={()=>{setAaddAddition(true)}} className={`cursor-pointer w-44 px-4 py-2 rounded ${
            addAddition ? activeClasses : inactiveClasses
          }`}>
        Add A New account
        </div>
    </div>
      <div>
    {!addAddition?
        <AddNewItem/>:
        <AddNewAccount/>}
        </div>
    </div>
  )
}

export default AddingPage