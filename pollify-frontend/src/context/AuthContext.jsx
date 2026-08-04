import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // 1. Add state for token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Read both user and token from localStorage on initialization
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user", err);
        localStorage.removeItem("user");
      }
    }

    if (storedToken) {
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (authToken) {
      setToken(authToken); // 3. Update token state on login
      localStorage.setItem("token", authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null); // 4. Clear token state on logout
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Helper getters
  const email = user?.email || "";

  return (
    // 5. Expose token and email in context value
    <AuthContext.Provider
      value={{ user, token, email, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
