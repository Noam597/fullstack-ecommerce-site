import React, { useEffect } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import { useUser } from '../../contexts/UserContexts';
import type { RootState, AppDispatch } from '../../redux/store';
import { addToCartAsync, decrementQuantityAsync, fetchCartAsync } from '../../redux/cart/cartThunks';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/products/productSlice';
import type { Products } from '../../redux/products/types';
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner';
import Pagination from '../../components/pagination/Pagination';

const Shop: React.FC = () => {
  const { user, loadingUser } = useUser();
  const products = useSelector((state: RootState) => state.products.products);
  const productsStatus = useSelector((state: RootState) => state.products.status);
  const cart = useSelector((state: RootState) => state.cart.items);
  const cart_id = useSelector((state: RootState) => state.cart.cart_id);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (productsStatus === 'idle') dispatch(fetchProducts());
  }, [dispatch, productsStatus]);

  useEffect(() => {
    if (user?.id && cart_id == null) dispatch(fetchCartAsync({ customerId: user.id }));
  }, [dispatch, user?.id, cart_id]);

  const handleAddToCart = (product: Products) => {
    if (!cart_id) return;
    dispatch(addToCartAsync({ cart_id, product_id: product.id, quantity: 1 }));
  };

  const handleRemoveFromCart = (product: Products) => {
    if (!cart_id) return;
    dispatch(decrementQuantityAsync({ cart_id, product_id: product.id, decrement: 1 }));
  };

  if (productsStatus === 'failed') return <div>Failed to load products.</div>;
  if (productsStatus === 'loading' || !user || products.length === 0 || !cart_id) return <LoadingSpinner />;

  return (
    <div className="w-full min-h-screen pt-[120px] pb-24 px-4 md:px-8 bg-gray-900">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
        WELCOME TO THE SHOP!
      </h1>

      {/* Pagination + Product Grid */}
      <Pagination items={products} itemsPerPage={10}>
        {(paginatedProducts) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {paginatedProducts.map((product) => {
              const { id, name, description, price, quantity, img, category } = product;
              const isInCart = cart_id ? cart?.some((item) => item.product_id === id) : false;

              return (
                <ProductCard
                  key={id}
                  loading={loadingUser}
                  id={id}
                  name={name}
                  description={description}
                  price={price}
                  quantity={quantity}
                  img={img}
                  category={category}
                  inCart={isInCart}
                  inShop={true}
                  onAddToCart={() => handleAddToCart(product)}
                  onRemoveFromCart={() => handleRemoveFromCart(product)}
                />
              );
            })}
          </div>
        )}
      </Pagination>
    </div>
  );
};

export default Shop;
