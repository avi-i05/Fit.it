import React from "react";
import KidsCollection from "../../components/KidsCollection";

const Kids = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Kids' Collection</h1>
        <KidsCollection />
      </section>
    </main>
  );
};

export default Kids;
