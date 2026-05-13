import { createContext, useContext, useMemo, useState } from "react";
import { api, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState("");

  const login = async (account, password) => {
    try {
      // Support both email and phone number login
      const isPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(account);
      const payload = isPhone
        ? { phone_number: account, password }
        : { email: account, password };
      const { data } = await api.post("/auth/login", payload);
      setTokenState(data.token);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại!";
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
