import Header from "./components/pages/header/Header"
import { Outlet } from "react-router-dom"
import Foooter from "./components/pages/footer/Foooter"
import AuthProvider from "./context/auth/AuthProvider"
import ToastProvider from "./context/toast/ToastProvider"

function App() {

  return (
    <AuthProvider>
      <ToastProvider>
        <Header/>
        <Outlet/>
        <Foooter/>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
