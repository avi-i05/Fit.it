import { useNavigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/Auth/authcontext";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Checking session...</div>;

  if (!isAuthenticated) {
    navigate("/login");
  }

  return <Outlet />;
};

export default ProtectedRoute;
