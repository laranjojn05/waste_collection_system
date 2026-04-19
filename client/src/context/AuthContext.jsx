import { useState } from "react";
import * as authService from "../services/authService";
import { AuthContext } from "./authContextObject";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const login = async (data) => {
    const res = await authService.login(data);
    localStorage.setItem("userInfo", JSON.stringify(res));
    setUser(res);
  };

  const signup = async (data) => {
    const res = await authService.signup(data);
    localStorage.setItem("userInfo", JSON.stringify(res));
    setUser(res);
  };

  const updateUser = async (data) => {
    const res = await authService.updateMe(data, user.token);
    localStorage.setItem("userInfo", JSON.stringify(res));
    setUser(res);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};