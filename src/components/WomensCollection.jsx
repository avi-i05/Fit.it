import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";

const products = [
  { id: "w1", name: "Floral Dress", price: 1199, image: "/floral dresses.jpeg" },
  { id: "w2", name: "High Waist Jeans", price: 1399, image: "/high weist jeans.jpeg" },
  { id: "w3", name: "Handbag", price: 999, image: "/item2.jpg" },
  { id: "w4", name: "Sandals", price: 799, image: "/sandles.jpeg" },
];

const WomensCollection = () => {
  const { addToCart } = useContext(CartContext);
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Women's Collection</h3>
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

export default WomensCollection;
