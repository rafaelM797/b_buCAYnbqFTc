"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Gift, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white rounded-lg p-2">
                <Gift className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">GestorBecas</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Características</a>
              <a href="#impact" className="text-gray-600 hover:text-gray-900">Impacto</a>
              <a href="#how" className="text-gray-600 hover:text-gray-900">Cómo funciona</a>
              <Link href="/auth/login">
                <Button variant="outline">Iniciar sesión</Button>
              </Link>
              <Link href="/auth/login">
                <Button className="bg-blue-600 hover:bg-blue-700">Acceder al sistema</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
            Sistema de gestión educativa
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            La plataforma completa para <span className="text-blue-600">gestionar becas</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Administra estudiantes, becas y solicitudes de manera eficiente. Un sistema integral para el sector educativo con seguimiento en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Comenzar ahora <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              Ver demostración
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <p className="text-gray-600">Estudiantes registrados</p>
              <p className="text-sm text-gray-500">En el sistema</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <p className="text-gray-600">Tasa de respuesta</p>
              <p className="text-sm text-gray-500">En solicitudes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <p className="text-gray-600">Becas activas</p>
              <p className="text-sm text-gray-500">Disponibles</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">3x</div>
              <p className="text-gray-600">Más rápido</p>
              <p className="text-sm text-gray-500">Procesamiento</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Cómo funciona el sistema</h2>
        <p className="text-center text-gray-600 mb-12">Un proceso simple y eficiente en cuatro pasos</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Registra estudiantes", description: "Agrega la información de los estudiantes al sistema" },
            { step: "02", title: "Configura becas", description: "Define los tipos de becas con sus requisitos y montos" },
            { step: "03", title: "Gestiona solicitudes", description: "Recibe y evalúa las solicitudes de forma ordenada" },
            { step: "04", title: "Analiza resultados", description: "Genera reportes y exporta datos para tomar decisiones" }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-light text-gray-300 mb-4">{item.step}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para modernizar tu gestión de becas?</h2>
          <p className="text-xl text-blue-100 mb-8">Accede al sistema y comienza a gestionar estudiantes, becas y solicitudes de forma eficiente.</p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
              Acceder al sistema <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6" />
              <span className="font-bold">GestorBecas</span>
            </div>
            <p className="text-gray-400">Sistema de Gestión de Becas y Ayudas Estudiantiles</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
