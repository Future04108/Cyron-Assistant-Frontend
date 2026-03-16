import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, DISCORD_REDIRECT_URL } from '../lib/config';
import { clearToken, getToken, setToken } from '../lib/storage';
import { api } from '../lib/api';

interface User {
  id: string;
  username: string;
  avatar_url?: string | null;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithDiscord: () => void;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get<User>('/auth/me');
      setUser(res.data);
    } catch {
      clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const loginWithDiscord = () => {
    const url = new URL('/auth/discord', API_BASE_URL);
    url.searchParams.set('redirect_uri', DISCORD_REDIRECT_URL);
    window.location.href = url.toString();
  };

  const logout = () => {
    clearToken();
    setUser(null);
    navigate('/', { replace: true });
  };

  const setAuthToken = (token: string) => {
    setToken(token);
    fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginWithDiscord,
        logout,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

