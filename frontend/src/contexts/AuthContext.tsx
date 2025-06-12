import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/global";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        } catch (error) {
          console.error("Falha ao parsear usuário do localStorage", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const signIn = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cooperativeToken");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
