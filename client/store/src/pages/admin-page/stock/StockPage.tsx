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
  const products = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.status === "loading");
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [updateQuantityValue, setUpdateQuantityValue] = useState<string>("");
  const [updatePriceValue, setUpdatePriceValue] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(product =>
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectSingleProduct = (product: Products) => {
    setSelectedProduct(product);
    setUpdatePriceValue(String(product.price));
    setUpdateQuantityValue(String(product.quantity));
  };

  const editItem = () => setIsEditing(!isEditing);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newPrice = Number(updatePriceValue);
    const newQuantity = Number(updateQuantityValue);

    if (newPrice !== selectedProduct.price) {
      await dispatch(updatePrice({ productId: selectedProduct.id, price: newPrice }));
    }

    if (newQuantity !== selectedProduct.quantity) {
      await dispatch(updateQuantity({ productId: selectedProduct.id, quantity: newQuantity }));
    }

    exitCard();
    dispatch(fetchProducts());
  };

  const exitCard = () => {
    setSelectedProduct(null);
    setUpdatePriceValue("");
    setUpdateQuantityValue("");
  };

  return (
    <div className="px-4 md:px-8 mt-8">
      <h1 className="text-3xl font-bold text-center mb-6">Inventory Management</h1>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <Inputs
          name="searchBar"
          placeholder="Search By Product Category..."
          label="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="button" onClick={() => setSearchTerm("")} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-lg">
          Clear
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Table */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Pagination items={filteredProducts} itemsPerPage={8}>
              {(pageProducts) => (
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageProducts.map((product) => (
                      <tr
                        key={product.id}
                        onClick={() => selectSingleProduct(product)}
                        className="cursor-pointer transition-colors duration-200 text-white hover:bg-blue-200 hover:text-blue-900"
                      >
                        <td className="px-4 py-2">{product.id}</td>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">{product.description}</td>
                        <td className="px-4 py-2">{product.category}</td>
                        <td className="px-4 py-2">{product.quantity}</td>
                        <td className="px-4 py-2">${product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Pagination>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="bg-black shadow-lg rounded-xl p-6 w-full">
            {!selectedProduct ? (
              <p className="text-gray-500 text-center">Select a product to view details</p>
            ) : (
              <form className="relative flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
  {/* X Button top-right */}
  <Button
    type="button"
    onClick={exitCard}
    className="absolute top-2 right-2 px-3 py-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
  >
    X
  </Button>

  {/* Headers & image centered */}
  <div className="text-center mt-6">
    <h3 className="text-gray-400 font-semibold">{selectedProduct.category}</h3>
    <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
    <img
      className="w-32 h-32 mx-auto rounded-lg object-cover mt-2"
      src={selectedProduct.img}
      alt={selectedProduct.name}
    />
    <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
  </div>

  {/* Inputs */}
  <div className="flex flex-col gap-3">
    <Inputs
      name="price"
      value={updatePriceValue}
      onChange={(e) => setUpdatePriceValue(e.target.value)}
      label="Price"
      readonly={isEditing}
    />
    <Inputs
      name="quantity"
      value={updateQuantityValue}
      onChange={(e) => setUpdateQuantityValue(e.target.value)}
      label="Stock Quantity"
      readonly={isEditing}
    />
  </div>

  {/* Buttons */}
  <div className="flex flex-col gap-2 mt-2 items-center">
    {isEditing ? (
      <Button
        type="button"
        onClick={editItem}
        className="bg-blue-600 hover:bg-blue-700 text-white w-32"
      >
        Edit Item
      </Button>
    ) : (
      <>
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white w-32"
        >
          Update
        </Button>
        <Button
          type="button"
          onClick={editItem}
          className="bg-gray-600 hover:bg-gray-700 text-white w-32"
        >
          Done
        </Button>
      </>
    )}
  </div>
</form>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
