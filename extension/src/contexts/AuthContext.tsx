import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import { useMutation } from 'urql';
import { authStorage } from '../utils/auth-storage';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../lib/queries';
import type { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: preact.ComponentChildren;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [, executeLogin] = useMutation(LOGIN_MUTATION);
  const [, executeRegister] = useMutation(REGISTER_MUTATION);

  // Load auth state on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          authStorage.getToken(),
          authStorage.getUser()
        ]);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await executeLogin({ email, password });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const { token: authToken, user: authUser } = result.data.login;
      
      await authStorage.saveAuth(authToken, authUser);
      setToken(authToken);
      setUser(authUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await executeRegister({
        input: { email, username, password }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const { token: authToken, user: authUser } = result.data.register;
      
      await authStorage.saveAuth(authToken, authUser);
      setToken(authToken);
      setUser(authUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authStorage.clearAuth();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};