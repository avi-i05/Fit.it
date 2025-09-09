import React from 'react'
import Header from './Components/Header/Header.jsx'
import { Outlet } from 'react-router-dom'
import Footer from './Components/Footer/Footer.jsx'
function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* All your page content */}
      </main>
      <Footer/>
    </div>
  )
}

export default Layout
