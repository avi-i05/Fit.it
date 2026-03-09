import AuthContext  from "./AuthContext";
import { useState, useEffect } from "react";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/me`, {
                    method: "GET",
                    credentials: "include", 
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    setIsAuthenticated(true);
                    setUser(data.admin);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (err) {
                setIsAuthenticated(false);
                setUser(null);
                console.log(err);
            } finally{
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    }

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    }


    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;