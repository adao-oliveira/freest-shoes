import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineArrowRight } from "react-icons/ai";

const CART_KEY = "cart";
const TOTAL_QUANTITIES_KEY = "totalQuantities";
const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  const [size, setSelectedSize] = useState(null);
  const [color, setselectedColor] = useState(null);

  // Função para calcular o preço total com base nos produtos no carrinho
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    let totalQty = 0;
    for (const item of cartItems) {
      totalPrice += item.price * item.quantity;
      totalQty += item.quantity;
    }
    setTotalPrice(totalPrice);
    setTotalQuantities(totalQty);
  };

  // Função para salvar o carrinho no localStorage
  const saveCartToLocalStorage = () => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    localStorage.setItem(TOTAL_QUANTITIES_KEY, totalQuantities.toString());
  };

  // Função para carregar o carrinho do localStorage
  const loadCartFromLocalStorage = () => {
    const cartData = localStorage.getItem(CART_KEY);
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }

    const totalQuantitiesData = localStorage.getItem(TOTAL_QUANTITIES_KEY);
    if (totalQuantitiesData) {
      setTotalQuantities(parseInt(totalQuantitiesData));
    }
  };

  // Carregue o carrinho do localStorage quando o componente for montado
  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  // Atualize o `localStorage` sempre que o carrinho for modificado
  useEffect(() => {
    saveCartToLocalStorage();
    calculateTotalPrice();
  }, [cartItems, totalQuantities]);

  const onAdd = (product, quantity, selectedSize, selectedColor) => {
    const checkProductInCart = cartItems.find(
      (item) =>
        item._id === product._id &&
        (item.size === selectedSize) & (item.color === selectedColor)
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      // Se o produto com o mesmo tamanho já estiver no carrinho, apenas atualize a quantidade
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (
          cartProduct._id === product._id &&
          cartProduct.size === selectedSize &&
          cartProduct.color === selectedColor
        ) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        }
        return cartProduct;
      });

      setCartItems(updatedCartItems);
    } else {
      // Se o produto com o tamanho diferente não estiver no carrinho, crie um novo item
      product.quantity = quantity;
      product.size = selectedSize;
      product.color = selectedColor;
      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>
          {quantity} {product.name} N°{selectedSize} Cor: {selectedColor}{" "}
        </p>
        <div style={{ textAlign: "right", width: "100%", cursor: "pointer" }}>
          <p onClick={() => setShowCart(true)}>Abrir carrinho <AiOutlineArrowRight /></p>
        </div>
      </div>,
      {
        className: "custom-toast",
        duration: 3000,
      }
    );
  };

  const onRemove = (product) => {
    const foundProduct = cartItems.find(
      (item) =>
        item._id === product._id &&
        item.size === product.size &&
        item.color === product.color
    );

    if (foundProduct) {
      const newCartItems = cartItems.filter(
        (item) =>
          item._id !== product._id ||
          item.size !== product.size ||
          item.color !== product.color
      );

      setTotalPrice(
        (prevTotalPrice) =>
          prevTotalPrice - foundProduct.price * foundProduct.quantity
      );
      setTotalQuantities(
        (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
      );
      setCartItems(newCartItems);
    }
  };

  const toggleCartItemQuantity = (id, value, size, color) => {
    const itemToUpdate = cartItems.find(
      (cartProduct) =>
        cartProduct._id === id &&
        cartProduct.size === size &&
        cartProduct.color === color
    );

    if (itemToUpdate) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (
          cartProduct._id === id &&
          cartProduct.size === size &&
          cartProduct.color === color &&
          value === "inc"
        ) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        } else if (
          cartProduct._id === id &&
          cartProduct.size === size &&
          cartProduct.color === color &&
          value === "dec" &&
          cartProduct.quantity > 1
        ) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          };
        }
        return cartProduct;
      });

      setCartItems(updatedCartItems);
      setCartItems(updatedCartItems);
      saveCartToLocalStorage();
      calculateTotalPrice();
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => (prevQty - 1 < 1 ? 1 : prevQty - 1));
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        size,
        color,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        setSelectedSize,
        setselectedColor,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
