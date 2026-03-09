import { Outlet } from "react-router-dom"
import AuthProvider from "./context/Auth/AuthProvider"
import Navbar from "./components/navbar/Navbar"
import Footer from "./components/footer/Footer"
import { Toaster } from "react-hot-toast";


function App() {

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Navbar/>
      <Outlet/>
      <Footer/>
    </AuthProvider>
  )
}

export default App
