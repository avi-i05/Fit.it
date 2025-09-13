import React, { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
const CartPage = () => {
  const { cart, removeFromCart, increment, decrement, totalPrice } = useContext(CartContext);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty 🛒</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-purple-600 font-bold">₹{item.price} × {item.qty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decrement(item.id)} className="px-3 py-1 bg-gray-200 rounded">-</button>
                <span>{item.qty}</span>
                <button onClick={() => increment(item.id)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
            <button className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
