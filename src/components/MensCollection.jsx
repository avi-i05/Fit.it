import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";

const products = [
  { id: "m1", name: "Men's Classic Tee", price: 799, image: "/tees.jpeg" },
  { id: "m2", name: "Relaxed Fit Jeans", price: 1299, image: "/men jeans.jpeg" },
  { id: "m3", name: "Hoodie", price: 1499, image: "/hoodies.jpeg" },
  { id: "m4", name: "Sneakers", price: 1999, image: "/nike.jpeg" },
];

const MensCollection = () => {
  const { addToCart } = useContext(CartContext);
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Men's Collection</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition">
            <img src={p.image} alt={p.name} className="w-full h-56 object-contain bg-gray-100" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-800">{p.name}</h4>
              <p className="text-gray-600 text-sm">₹{p.price}</p>
              <button onClick={() => addToCart(p)} className="mt-2 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MensCollection;
