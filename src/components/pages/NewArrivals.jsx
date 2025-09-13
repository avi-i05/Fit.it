import React, { useContext } from "react";
import { CartContext } from "../../Context/CartContext";

const items = [
  { id: "n1", name: "Athleisure Set", price: 1499, image: "/item3.jpg" },
  { id: "n2", name: "Denim Jacket", price: 1799, image: "/item4.jpg" },
  { id: "n3", name: "Casual Sneakers", price: 1999, image: "/item5.jpg" },
  { id: "n4", name: "Minimal Tee", price: 699, image: "/men.jpg" },
];

const NewArrivals = () => {
  const { addToCart } = useContext(CartContext);
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((p) => (
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

export default NewArrivals;
