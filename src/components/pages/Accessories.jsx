import React from "react";
import AccessoriesCollection from "../../components/AccessoriesCollection";

const Accessories = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Accessories</h1>
        <AccessoriesCollection />
      </section>
    </main>
  );
};

export default Accessories;
