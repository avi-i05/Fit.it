import { getProfile } from "../../api/auth";
import AuthContext from "./authcontext";
import { useState, useEffect } from "react";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getProfile(); 

        if (res.data.success) {
          setIsAuthenticated(true);
          setUser(res.data.data.seller);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
        console.log("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginContext = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logoutContext = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loginContext,
        logoutContext,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;