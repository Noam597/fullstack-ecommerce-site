import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { fetchProducts } from '../../redux/products/productSlice';
import ProductCard from '../../components/productCard/ProductCard';
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner';
import Inputs from '../../components/inputs/Inputs';

const ProductsPage: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.status === 'loading');
  const error = useSelector((state: RootState) => state.products.error);
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-red-600 text-xl">Error: Our server is down. Please try again later.</h1>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 min-h-screen bg-gray-900">
      {/* Search bar */}
      <div className="flex justify-center mb-6">
        <Inputs
          name="searchBar"
          label="Search Products"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* No products found */}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-300 text-lg">No products found matching your search.</p>
      )}

      {/* Products grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!loading &&
          filteredProducts.map((product) => (
            <ProductCard key={product.id} loading={loading} {...product} inCart={false} />
          ))}
      </div>
    </div>
  );
};

export default ProductsPage;
