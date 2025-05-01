
import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    // Hard-coded credentials as requested
    if (email === 'rizontec@gmail.com' && password === 'rtec2024') {
      setUser({
        email,
        isAuthenticated: true
      });
      
      // Save to localStorage for session persistence
      localStorage.setItem('user', JSON.stringify({ email }));
      
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao painel administrativo',
      });
      
      return true;
    } else {
      toast({
        title: 'Erro no login',
        description: 'Email ou senha incorretos',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da sua conta',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
