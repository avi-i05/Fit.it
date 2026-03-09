import {useContext} from 'react'
import AuthContext from '../../../context/auth/AuthContext'
import { useNavigate } from 'react-router-dom';

function Header() {
  const {isAuthenticated, logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/login");
  }



  return (

    <header className="w-full h-16 bg-gray-800 text-white flex items-center px-6 shadow z-10">
      
      <h1 className="text-xl font-semibold tracking-wide">
        Admin Dashboard
      </h1>

      <div className="ml-auto flex items-center space-x-4">
        <div className="w-8 h-8 rounded-full bg-gray-600"></div>
        <p className="text-sm">{isAuthenticated ? "Admin" : "Guest"}</p>
        {isAuthenticated &&
        <button onClick={handleLogout} className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md">
          Logout
        </button>}
      </div>

    </header>
  )
}

export default Header
