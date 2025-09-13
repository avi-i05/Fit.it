import React, { useContext } from "react";
import { CartContext, CartProvider } from "../../Context/CartContext";
const products = [
  { id: 1, name: "Casual T-Shirt", price: "₹499", image: "/shirt1.jpg" },
  { id: 2, name: "Sneakers", price: "₹1299", image: "/shoes1.jpg" },
  { id: 3, name: "Denim Jacket", price: "₹1799", image: "/jacket1.jpg" },
  { id: 4, name: "Summer Dress", price: "₹899", image: "/dress1.jpg" },
];

const Shop = () => {
  const { addToCart} = useContext(CartContext);
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Shop Now</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
            <div className="p-4 flex flex-col items-center">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-purple-600 font-bold">{item.price}</p>
              <button onClick={()=> addToCart(item)} className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
