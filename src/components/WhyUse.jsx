import React from "react";
import { Truck, ShieldCheck, BadgeCheck, Headset } from "lucide-react";

const features = [
  { id: 1, title: "Fast Delivery", desc: "Get your fashion in under 40 minutes.", Icon: Truck },
  { id: 2, title: "Best Quality", desc: "Curated styles from trusted brands.", Icon: ShieldCheck },
  { id: 3, title: "Affordable Prices", desc: "Trendy looks that don’t break the bank.", Icon: BadgeCheck },
  { id: 4, title: "Customer Support", desc: "We’re here to help — anytime.", Icon: Headset },
];

const WhyUse = () => {
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Why use FIT.IT?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map(({ id, title, desc, Icon }) => (
          <div key={id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3 text-purple-600">
              <Icon size={22} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUse;
