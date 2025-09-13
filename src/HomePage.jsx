import React from 'react'

import Categories from './components/Categories'
import BestSellers from './components/BestSellers'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import MensCollection from './components/MensCollection'
import WomensCollection from './components/WomensCollection'
import WhyUse from './components/WhyUse'
import Newsletter from './components/Newsletter'
import KidsCollection from './components/KidsCollection'
import AccessoriesCollection from './components/AccessoriesCollection'

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <HeroSection/>
      <Categories/>
      <MensCollection/>
      <WomensCollection/>
      <KidsCollection/>
      <AccessoriesCollection/>
      <BestSellers/>
      <WhyUse/>
      <Newsletter/>
      <Footer/>
    </div>
  )
}

export default HomePage
