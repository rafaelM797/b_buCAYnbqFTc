"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserEstudiante {
  id: string;
  nivel_educativo: string;
  institucion: string;
  promedio: number;
  carrera: string;
}

export interface UserBeca {
  id: string;
  nombre: string;
  tipo: string;
  monto: number;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  nombre?: string;
  apellidos?: string;
  rol?: string;
  estudiante?: UserEstudiante;
  beca?: UserBeca;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (email: string, password: string, full_name: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseFullName = (fullName: string) => {
  const parts = fullName.trim().split(" ").filter(Boolean);
  return {
    nombre: parts[0] ?? "",
    apellidos: parts.slice(1).join(" ") || "",
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const API_URL =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:8000`
      : "http://localhost:8000";

  const normalizeUser = (data: { id: string; email: string; full_name: string; role: string }): User => {
    const { nombre, apellidos } = parseFullName(data.full_name);
    return {
      ...data,
      nombre,
      apellidos,
      rol: data.role,
    };
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Login failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      const normalizedUser = normalizeUser(data);
      setUser(normalizedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      }
      return normalizedUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, full_name: string) => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/auth/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name, role: "user" }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Registration failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      const normalizedUser = normalizeUser(data);
      setUser(normalizedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      }
      return normalizedUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export const MOCK_DATA = {
  convocatorias: [
    {
      id: "conv-001",
      nombre: "Beca de Excelencia Academica 2025",
      tipo: "academica",
      monto: 4000,
      fecha_inicio: "2025-03-01",
      fecha_fin: "2025-04-30",
      requisitos: "Promedio minimo de 8.0, estar matriculado en universidad publica",
      cupos: 50,
      estado: "abierta",
    },
    {
      id: "conv-002",
      nombre: "Ayuda al Transporte Escolar",
      tipo: "necesidad",
      monto: 800,
      fecha_inicio: "2025-02-15",
      fecha_fin: "2025-03-15",
      requisitos: "Distancia mayor a 20km del centro educativo",
      cupos: 200,
      estado: "abierta",
    },
    {
      id: "conv-003",
      nombre: "Beca Deportiva de Alto Rendimiento",
      tipo: "deportiva",
      monto: 5000,
      fecha_inicio: "2025-05-01",
      fecha_fin: "2025-06-30",
      requisitos: "Formar parte de seleccion nacional o regional",
      cupos: 25,
      estado: "proxima",
    },
  ],
  usuariosAdmin: [
    {
      id: "2",
      email: "afa@outlook.com",
      nombre: "Alfonso",
      apellidos: "Rodriguez Lopez",
      estado: "activo",
      beca: "Beca de Excelencia Academica",
      fecha_registro: "2024-01-15",
    },
    {
      id: "3",
      email: "maria@email.com",
      nombre: "Maria",
      apellidos: "Fernandez Ruiz",
      estado: "pendiente",
      beca: "Ayuda al Transporte",
      fecha_registro: "2024-02-20",
    },
    {
      id: "4",
      email: "carlos@email.com",
      nombre: "Carlos",
      apellidos: "Sanchez Gomez",
      estado: "activo",
      beca: "Beca Deportiva",
      fecha_registro: "2024-01-10",
    },
    {
      id: "5",
      email: "laura@email.com",
      nombre: "Laura",
      apellidos: "Martinez Diaz",
      estado: "baja",
      beca: "Beca de Excelencia",
      fecha_registro: "2023-09-01",
      fecha_baja: "2024-06-15",
      motivo_baja: "Finalizacion de estudios",
    },
    {
      id: "6",
      email: "pedro@email.com",
      nombre: "Pedro",
      apellidos: "Lopez Hernandez",
      estado: "pendiente",
      beca: "Beca de Investigacion",
      fecha_registro: "2024-03-01",
    },
  ],
  becasOtorgadas: [
    { tipo: "academica", nombre: "Beca de Excelencia", cantidad: 45, monto_total: 157500 },
    { tipo: "deportiva", nombre: "Beca Deportiva", cantidad: 12, monto_total: 60000 },
    { tipo: "necesidad", nombre: "Ayuda Economica", cantidad: 78, monto_total: 62400 },
    { tipo: "investigacion", nombre: "Beca de Investigacion", cantidad: 8, monto_total: 48000 },
  ],
};
