import React from 'react'

const HeroSection = () => {
  return (
    <section className="bg-gray-100 py-20 text-center">
      <div className="container mx-auto px-6">
        <div className="inline-block animate-slide-up">
          <span className="inline-block bg-purple-500 text-white text-2xl md:text-4xl font-bold rounded-full px-6 md:px-10 py-3 md:py-4 shadow-lg ring-4 ring-purple-300/60">
            Get Fashion Delivered in 40 Minutes.
          </span>
        </div>
        <p className="animate-fade-in text-gray-700 mt-6 max-w-2xl mx-auto">
       
          Shop the latest trends and receive them at your doorstep in record time!
        
        </p>
      </div>
    </section>
  )
}

export default HeroSection
