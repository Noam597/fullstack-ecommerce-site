import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import type { Products } from "../../../redux/products/types";
import { fetchProducts } from "../../../redux/products/productSlice";
import { updatePrice, updateQuantity } from "../../../redux/admin/inventory/inventoryThunks";
import Inputs from "../../../components/inputs/Inputs";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import Button from "../../../components/button/Button";
import Pagination from "../../../components/pagination/Pagination";

const StockPage = () => {

  const  products  = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state:RootState)=> state.products.status === "loading")
  const dispatch = useDispatch<AppDispatch>()
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [updateQuantityValue, setUpdateQuantityValue] = useState<string>("")
  const [updatePriceValue, setUpdatePriceValue] = useState<string>("")


  useEffect(() => {
    dispatch(fetchProducts())
  
    
  }, [dispatch])
  
 
  const filteredProducts = products.filter(product =>
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectSingleProduct = (product: Products)=>{
    if(!product){
      return
    }
      setSelectedProduct(product);
      setUpdatePriceValue(String(product.price))
      setUpdateQuantityValue(String(product.quantity))
      console.log(`${product.name} Selected`)

  }

  const editItem = ()=>{
    setIsEditing(!isEditing)
    
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if (!selectedProduct) return;


  const newPrice = Number(updatePriceValue);
  const newQuantity = Number(updateQuantityValue);

  // Price changed?
  if (newPrice !== selectedProduct.price) {
    await dispatch(updatePrice({
      productId: selectedProduct.id,
      price: newPrice
    }));
  }

  // Quantity changed?
  if (newQuantity !== selectedProduct.quantity) {
   await dispatch(updateQuantity({
      productId: selectedProduct.id,
      quantity: newQuantity
    }));
  }

 
  exitCard()
  dispatch(fetchProducts())
  }

  const exitCard = ()=>{
    setSelectedProduct(null);
    setUpdatePriceValue("");
    setUpdateQuantityValue("");
    console.log("Card cleared")
  }

  return (
    <div >
      <h1>Item Inventory</h1>

      {loading && <LoadingSpinner/>}
      
      <Inputs name='searchBar' placeholder='Search By Product Name..' label='Search' value={searchTerm} onChange={e=>{setSearchTerm(e.target.value)}}/><button onClick={()=>{setSearchTerm("")}}>clear</button>
      <div className="flex flex-wrap justify-center">
        <div className="flex flex-col">
  {!loading && <Pagination items={filteredProducts} itemsPerPage={8}>
    {(products)=>(
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
        
        
         {products.map((product)=>(
          <tr key={product.id} 
              onClick={() => selectSingleProduct(product)}
              className="cursor-pointer hover:bg-blue-200 text-blue-400"
               >
            <td >{product.id}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>{product.category}</td> 
            <td>{product.quantity}</td>
            <td>${product.price}</td>
          </tr>
          ))}
         
        </tbody>
        
      </table>
      )}</Pagination> }
</div>
      <div>
          <h1>Product</h1>
          
        {!selectedProduct ? (
    <p>Select a product to view details</p>
    ):(
        <form className="flex flex-col w-[350px]" onSubmit={handleSubmit}>
          <Button type="button" onClick={exitCard}>X</Button>
        <h3>{selectedProduct.category}</h3>
        <h2>{selectedProduct.name}</h2>
        <img className="w-24 h-24 m-auto" src={selectedProduct.img} alt={selectedProduct.name}/>
        <p>{selectedProduct.description}</p>
        <Inputs name="price"
                value={updatePriceValue}
                onChange={(e)=>{setUpdatePriceValue(e.target.value)}} 
                label="Price"
                readonly={isEditing}
                />
        <Inputs name="quantity" 
                value={updateQuantityValue}
                onChange={(e)=>{setUpdateQuantityValue(e.target.value)}} 
                label="Stock Quantity"
                readonly={isEditing}
                />
        {isEditing?
        <Button type="button" onClick={editItem}>Edit Item</Button>:
        <>
          <div>
            <Button type="submit">Update</Button>
          </div>
            <Button type="button" onClick={editItem}>Done</Button>
          </>}
        </form>)}
        </div>
      </div>
    </div>
  )
}

export default StockPage