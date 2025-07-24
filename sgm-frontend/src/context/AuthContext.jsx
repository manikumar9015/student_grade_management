import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../services/apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      if (token) {
        // Decode the token to get user info
        const decodedUser = jwtDecode(token);

        // This was the main error: it should be [0], not [null]
        const role = decodedUser.authorities[0].authority;
        console.log(role)
        setUser({ email: decodedUser.sub, role: role });
      } else {
        setUser(null);
      }
    } catch (error) {
      // If token is invalid or expired, log out
      console.error("Invalid token:", error);
      setToken(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
