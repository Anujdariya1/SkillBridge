import { createContext, useEffect, useState } from "react";
import { loginUser, logoutUser } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load token on first app mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // 🔐 Login
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }

    return data;
  };

  // 🚪 Logout
  const logout = () => {
    logoutUser(); // removes token from storage
    setToken(null);
  };

  const value = {
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
