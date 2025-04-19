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
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user');

    if (token) setToken(token);

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        setUser(null);
      }
    }
  }, []);

  // Login handler
  const login = (userData, tokenData, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('token', tokenData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    }

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
