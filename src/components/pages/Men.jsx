import React from "react";
import MensCollection from "../../components/MensCollection";

const Men = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Men's Collection</h1>
        <MensCollection />
      </section>
    </main>
  );
};

export default Men;
