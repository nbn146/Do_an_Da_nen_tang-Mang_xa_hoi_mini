import { createContext, useContext, useMemo, useState } from "react";
import { api, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState("");

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setTokenState(data.token);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { ok: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      setTokenState(data.token);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || "Register failed";
      return { ok: false, message };
    }
  };

  const logout = () => {
    setTokenState("");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
