import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../redux/store'
import { fetchProducts } from '../../redux/products/productSlice';
import ProductCard from '../../components/productCard/ProductCard';
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner';
import Inputs from '../../components/inputs/Inputs';


const ProductsPage:React.FC = () => {

    const  products  = useSelector((state: RootState) => state.products.products);
    const loading = useSelector((state:RootState)=> state.products.status === "loading")
    const error = useSelector((state:RootState)=> state.products.error)
    const dispatch = useDispatch<AppDispatch>()

  const [searchTerm, setSearchTerm] = useState<string>('')

    useEffect(() => {
      dispatch(fetchProducts())
    
      
    }, [dispatch])
    
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if(error){
      return <h1>Error: Our server is down. Please try again later.</h1>
    }
  return (
    <>

    {loading && <LoadingSpinner/>}

    <Inputs  name='searchBar' 
             placeholder='Search By Product Name..' 
             label='Search' value={searchTerm} 
             onChange={e=>{setSearchTerm(e.target.value)}}
             className='w-96'
             />
    <div className='flex flex-wrap justify-evenly'>
        {!loading && filteredProducts.map((product)=>(
          
            <ProductCard key={product.id} 
                        loading={loading}
                        {...product}
                        inCart={false}
                        /> )
        )}
        
    </div>
    </>
  )
}

export default ProductsPage