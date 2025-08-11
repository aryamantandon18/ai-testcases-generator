import React, { createContext, useEffect, useState } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("tcg_token") || null);
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");

    console.log("Line 12 ........",t);
    if (t) {
      console.log("Token received:", t); // Debug log
      localStorage.setItem("tcg_token", t);
      setToken(t);
          // Clear the URL without causing a reload
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
      setLoading(false);
    }else{
      setLoading(false);
    }
  }, []);

   // Fetch user when token changes
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const resp = await API.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(resp.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        localStorage.removeItem("tcg_token");
        setToken(null);
      }
    })();
  }, [token]);

    const logout = () => {
    localStorage.removeItem("tcg_token");
    setToken(null);
    setUser(null);
  };
  return <AuthContext.Provider value={{ token, setToken, user, loading,setUser,logout }}>{children}</AuthContext.Provider>;
}
