import React, { createContext, useState, useEffect } from 'react';
import productsData from '../server/products.json';


const ProductContext = createContext();

const exchangeRates = {
  INR: 1,
  USD: 0.012,
  EURO: 0.011,
};

const symbols = {
  INR: '₹',
  USD: '$',
  EURO: '€',
};

const ProductProvider = ({ children }) => {

// for Dashboard



// for frontedn

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    setProducts(productsData);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity }];
    });
  };

  const addToCartFromStore = (product, size = "L") => {
    addToCart({ ...product, quantity: 1, selectedSize: size });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.id === productId && item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (productId, selectedSize, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.find((item) => item.id === product.id)) {
        return prevWishlist;
      }
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter(
      (item) => item.id !== productId
    ));
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const convertPrice = (price) => {
    return price * exchangeRates[currency];
  };

  const getSymbol = () => {
    return symbols[currency];
  };






  return (
    <ProductContext.Provider value={{
      products,
      cart,
      addToCart,
      addToCartFromStore,
      removeFromCart,
      updateQuantity,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      currency,
      changeCurrency,
      convertPrice,
      getSymbol
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
