import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Hook to use the context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load from localStorage/sessionStorage on mount
  useEffect(() => {
    const storedToken =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    const storedUserRaw =
      localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken) setToken(storedToken);

    if (storedUserRaw && storedUserRaw !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUserRaw);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Failed to parse user JSON:', error);
        setUser(null);
      }
    } else {
      setUser(null); // Clear it if invalid
    }
  }, []);

  // Login handler
  const login = (userData, tokenData, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('token', tokenData);
    storage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setToken(tokenData);
  };

  // Logout handler
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
