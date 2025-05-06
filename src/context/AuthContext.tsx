
import React, { createContext, useState, useContext, useEffect } from "react";

export type UserRole = "admin" | "user";

interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  users: User[];
  deleteUser: (userId: string) => void;
}

// Mock de base de datos inicial
const initialUsers: User[] = [
  { id: "admin-1", username: "admin", role: "admin" },
  { id: "user-1", username: "usuario", role: "user" },
];

// Mock de contraseñas (en una aplicación real, estas estarían hasheadas y almacenadas de forma segura)
const passwords: Record<string, string> = {
  "admin-1": "admin123",
  "user-1": "user123",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Comprobar si hay un usuario en localStorage al cargar la página
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Simulando una validación de credenciales
    const userFound = users.find(user => user.username === username);
    
    if (!userFound || passwords[userFound.id] !== password) {
      throw new Error("Credenciales inválidas");
    }
    
    setCurrentUser(userFound);
    localStorage.setItem("currentUser", JSON.stringify(userFound));
  };

  const register = async (username: string, password: string, role: string) => {
    // Comprobar si el usuario ya existe
    if (users.some(user => user.username === username)) {
      throw new Error("El usuario ya existe");
    }
    
    // En una aplicación real, aquí se haría la llamada a la API
    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      username,
      role: role as UserRole,
    };
    
    // Actualizar la lista de usuarios y contraseñas
    setUsers(prevUsers => [...prevUsers, newUser]);
    passwords[newUserId] = password;
    
    console.log("Usuario registrado:", newUser);
    console.log("Usuarios actuales:", [...users, newUser]);
    return Promise.resolve();
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const deleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      throw new Error("No puedes eliminar tu propio usuario");
    }
    
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    delete passwords[userId];
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        users,
        deleteUser
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
