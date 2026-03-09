import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/auth/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Checking session...</div>
  
  if (!isAuthenticated){ 
    <Navigate to="/login" replace />
   }

  return <Outlet />;
};

export default ProtectedRoute;
