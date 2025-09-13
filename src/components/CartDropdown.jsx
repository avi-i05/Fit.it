import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";

const CartDropdown = ({ open }) => {
  const { cart, increment, decrement, removeFromCart, totalPrice } = useContext(CartContext);
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-lg shadow-xl p-4 z-40">
      <h4 className="font-semibold mb-3">Your Cart</h4>
      {cart.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover bg-gray-100" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => decrement(item.id)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                <button onClick={() => increment(item.id)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 bg-red-500 text-white rounded">×</button>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 text-right">
            <p className="font-semibold">Total: ₹{totalPrice}</p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
