import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("chatUser")) || null,
  );

  const login = (userData) => {
    localStorage.setItem("chatUser", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("chatUser");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
