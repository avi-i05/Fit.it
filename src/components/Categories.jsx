import React from 'react'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate();
  const Categories = [
  { name: "Men", img: "/men.jpg" },
  { name: "Women", img: "/women.jpg" },
  { name: "Kids", img: "/kids.jpg" },
  { name: "Accessories", img: "/accessories.jpg" }
];
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
        <h3 className=" text-2xl font-bold mb-6 text-gray-800">Shop by Category </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          { Categories.map((category, index)=>(
          <div key={index}
          className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:scale-105 active:scale-100 transition"
          onClick={() => {
            if (category.name === 'Men') navigate('/men');
            else if (category.name === 'Women') navigate('/women');
            else if (category.name === 'Kids') navigate('/kids');
            else if (category.name === 'Accessories') navigate('/accessories');
            else navigate('/shop');
          }}>
             <img
                src={ category.img}
                alt={category.name}
                className="w-full h-48 md:h-60 object-contain bg-gray-200"
              />
              <div className="p-4 text-center font-semibold">{category.name}</div>
            </div>
        ))}</div>
      </section>

  )
}

export default Categories
