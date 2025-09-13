import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("fitit_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to parse user from storage", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("fitit_user", JSON.stringify(user));
      else localStorage.removeItem("fitit_user");
    } catch (e) {
      console.error("Failed to persist user", e);
    }
  }, [user]);

  const login = ({ email, password }) => {
    // Demo auth: accept any non-empty email/password
    if (!email || !password) throw new Error("Email and password are required");
    const name = email.split("@")[0];
    setUser({ name, email });
  };

  const register = ({ name, email, password, confirmPassword }) => {
    if (!name || !email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    setUser({ name, email });
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
