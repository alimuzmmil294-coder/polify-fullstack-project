import { createContext, useContext, useState } from "react";
import { createCurrentUser } from "../data/mockData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  // Set user after successful login/signup from a component
  function login(userData) {
    const nextUser = createCurrentUser(
      userData?.name || userData?.email?.split("@")[0] || "User",
      userData?.email || "",
      userData?.handle || ""
    );

    setUser(nextUser);
    setEmail(userData?.email || "");
  }

  // Clear user state on logout
  function logout() {
    setUser(null);
    setEmail("");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
