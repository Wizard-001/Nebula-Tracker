import { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          const { data } = await api.get('/api/auth/me');
          setUser({ ...data, token: parsedUser.token });
        }
      } catch (error) {
        console.error('Error verifying token', error);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || (error.message === 'Network Error' ? 'Cannot connect to server. Is the backend running?' : 'Login failed');
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || (error.message === 'Network Error' ? 'Cannot connect to server. Is the backend running?' : 'Registration failed');
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
