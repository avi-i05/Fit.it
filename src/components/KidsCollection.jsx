import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";

const products = [
  { id: "k1", name: "Kids T-Shirt", price: 499, image: "/kidstees.jpeg" },
  { id: "k2", name: "Kids Jeans", price: 799, image: "/kids jeans.jpeg" },
  { id: "k3", name: "Kids Sneakers", price: 999, image: "/kidssneakes.jpeg" },
  { id: "k4", name: "Kids Hoodie", price: 899, image: "/kidshoodies.jpeg" },
];

const KidsCollection = () => {
  const { addToCart } = useContext(CartContext);
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Kids' Collection</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition">
            <img loading="lazy" src={p.image} alt={p.name} className="w-full h-56 object-contain bg-gray-100" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-800">{p.name}</h4>
              <p className="text-gray-600 text-sm">₹{p.price}</p>
              <button onClick={() => addToCart(p)} className="mt-2 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 active:scale-[.98] transition shadow-sm hover:shadow">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KidsCollection;
