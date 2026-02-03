import React,{useState, type FormEvent} from 'react'
import Inputs from '../../../components/inputs/Inputs';
import Button from '../../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { addUserAsync } from '../../../redux/admin/accounts/accountsThunks';

const passwordCheck =/^(?=.*[a-z])(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[!@#$%&])[a-zA-Z0-9?!@#$%&]{8,}$/
const emailCheck = /^([a-zA-Z0-9\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,3})?$/i

const AddNewAccount:React.FC = () => {


    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("")


    const handleSubmit = async (e:FormEvent)=>{
        e.preventDefault();
        if(!name || !surname || !role || !email || !password){
                setError("All fields Required")
                return
            }
        if(!emailCheck.test(email)){
                setError("Invalid Email Address")
                return 
        }
        if(!passwordCheck.test(password)){
                setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character ")
                return 
        }
        let newUser = {
                name ,
                surname, 
                role ,
                email ,
                password
        }
        await dispatch(addUserAsync(newUser))
        navigate("/accounts")

    }      




  return (
    <div className='m-5'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
  <Inputs label="Name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" />
  <Inputs label="Surname" name="surname" value={surname} onChange={e => setSurname(e.target.value)} placeholder="Enter surname" />

  <select
    className="bg-gray-500 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={role}
    onChange={e => setRole(e.target.value)}
  >
    <option value="" disabled>Select a role</option>
    <option value="buyer">Buyer</option>
    <option value="admin">Admin</option>
  </select>

  <Inputs label="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" />
  <Inputs label="Password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />

  {error && <p className="text-red-500 text-sm">{error}</p>}

  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
    Submit
  </Button>
</form>

    </div>
  )
}

export default AddNewAccount