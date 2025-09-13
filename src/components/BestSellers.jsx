import React, { useContext } from 'react'
import { CartContext } from "../Context/CartContext";

const BestSellers = () => {
  const { addToCart } = useContext(CartContext);
  const bestSellers = [
    { id: "b1", name: "Stylish Shirts", price: 799, image: "/item4.jpg" },
    { id: "b2", name: "Jeans", price: 999, image: "/item3.jpg" },
    { id: "b3", name: "Kids Wear", price: 599, image: "/item5.jpg" },
    { id: "b4", name: "Hand Bags", price: 499, image: "/item2.jpg" },
  ];
  return (
 
<section className="max-w-6xl mx-auto py-12 px-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Best Sellers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">{bestSellers.map((item) =>(
            <div key={item.id}
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition">
           <img
                loading="lazy"
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-contain bg-gray-100"
              />
              <div className="p-4">
                <h4 className="font-semibold text-gray-800"> {item.name}</h4>
                <p className="text-gray-600 text-sm">₹{item.price}</p>
                <button onClick={() => addToCart(item)} className="mt-2 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 active:scale-[.98] transition shadow-sm hover:shadow">Add to Cart</button>
              </div>
            </div>
          ))}
          </div>
        </section>
  )}
export default BestSellers
