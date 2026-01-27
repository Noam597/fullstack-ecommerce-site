import React,{useState} from 'react'
import Inputs from '../../../components/inputs/Inputs';
import Button from '../../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../redux/store';
import { addNewItem } from '../../../redux/admin/inventory/inventoryThunks';

const AddNewItem:React.FC = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()
        if(!name || !description || !price || !quantity || !category){
            setError("All fields Required")
            return
        }
        if(!image){
            setImage("https://www.example.com/")
        }
        const item = {
            name,
            description,
            img:image,
            price:parseInt(price),
            quantity:parseInt(quantity),
            category
        }
        dispatch(addNewItem(item))
        navigate("/stock")
    }   

  return (
    <div className='m-5'>
        <form onSubmit={handleSubmit} className='w-[352px] h-[404px]'>
            <Inputs label='Name' 
                    name='name' 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)}
                    placeholder='Enter name'
                    />
            <Inputs label='Description' 
                    name='description' 
                    value={description} 
                    onChange={(e)=>setDescription(e.target.value)}
                    placeholder='Add Description'
                    />
            {/*role select*/}
            <Inputs label='Image URL' 
                    name='img' 
                    value={image} 
                    onChange={(e)=>setImage(e.target.value)}
                    placeholder='Add image of product'
                    />
            <Inputs label='Price' 
                    name='price' 
                    value={price} 
                    onChange={(e)=>setPrice(e.target.value)}
                    placeholder='Add price'
                    />
            <Inputs label='Quantity' 
                    name='quantity' 
                    value={quantity} 
                    onChange={(e)=>setQuantity(e.target.value)}
                    placeholder='Add Quantity'
                    />
                    <select value={category} onChange={(e)=>{setCategory(e.target.value)}} className='bg-black text-white'>
                        <option value="" disabled>Select a Category</option>
                        <option value="Audio">Audio</option>
                        <option value="Video / TVs & Displays">Video / TVs & Displays</option>
                        <option value="Computers & Accessories">Computers & Accessories</option>
                        <option value="Mobile Devices">Mobile Devices</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Cameras & Photography">Cameras & Photography</option>
                        <option value="Home Appliances">Home Appliances</option>
                        <option value="Wearables & Health Tech">Wearables & Health Tech</option>
                        <option value="Networking">Networking</option>
                        <option value="Power & Batteries">Power & Batteries</option>
                        <option value="Car Electronics">Car Electronics</option>
                        <option value="Office Electronics">Office Electronics</option>
                        <option value="Miscellaneous / Accessories">Miscellaneous / Accessories</option>
                    </select>
                    {error && <p className='text-red-500'>{error}</p>}
                    <br/>
            <Button type='submit'>Submit</Button>
        </form>
    </div>
  )
}

export default AddNewItem