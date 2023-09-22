import React, { useEffect } from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { Cart } from "./";
import { useStateContext } from "../context/StateContext";

const CART_KEY = "cart";

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities, setTotalQuantities } =
    useStateContext();

  useEffect(() => {
    // Carregue a contagem de itens do carrinho do localStorage quando o componente for montado
    const cartData = localStorage.getItem(CART_KEY);
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      let totalQty = 0;
      for (const item of parsedCart) {
        totalQty += item.quantity;
      }
      setTotalQuantities(totalQty);
    }
  }, []);

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">
          <img src="https://res.cloudinary.com/robles-identity/image/upload/v1694209505/Logotipo_Moda_Feminina_Minimalista_Preto_200_200_px_fbyrsv.png" />
        </Link>
      </p>
      <button
        type="button"
        className="cart-icon"
        onClick={() => setShowCart(true)}
      >
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>
      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
