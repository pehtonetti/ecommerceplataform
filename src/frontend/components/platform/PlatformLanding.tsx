'use client';

import { motion } from 'framer-motion';
import { ArrowRight, LayoutTemplate, Palette, Rocket, Store, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLayoutEffect, useState, useEffect } from 'react';

export default function PlatformLanding() {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  const features = [
    {
      icon: <LayoutTemplate className="w-6 h-6 text-indigo-400" />,
      title: 'Editor Visual Completo',
      description: 'Construa sua vitrine arrastando e soltando blocos, sem precisar de código.'
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      title: 'Poderoso Motor de Temas',
      description: 'Personalize cores, tipografia e design com apenas alguns cliques.'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Desempenho Extremo',
      description: 'Sua loja ultra-rápida, otimizada para SEO e altas taxas de conversão.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none opacity-50" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tightest bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Simplify
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link 
            href="/register/store" 
            className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-transform active:scale-95"
          >
            Criar loja
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8"
        >
          <Rocket className="w-4 h-4 text-indigo-400" />
          <span>A revolução do E-commerce Multi-Tenant</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
        >
          Crie sua loja virtual <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            em menos de 5 minutos.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12"
        >
          A plataforma Definitiva para lojistas de alta performance. Gerencie produtos, pedidos, design visual e clientes em um ecossistema unificado.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link 
            href="/register/store" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-500 transition-all border border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
          >
            Experimente Grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all border border-white/10 active:scale-95"
          >
            Já sou lojista
          </Link>
        </motion.div>

        {/* Mockup Dashboard / Platform Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-full mt-24 relative p-[1px] rounded-xl bg-gradient-to-b from-white/20 to-transparent"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 rounded-xl" />
          <div className="rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl relative aspect-video flex flex-col">
            {/* Fake Browser Top */}
            <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="w-64 h-6 bg-white/5 rounded mx-auto border border-white/5 flex items-center justify-center text-xs text-gray-500">
                simplify.com.br/dashboard
              </div>
            </div>
            {/* Fake Dashboard Body */}
            <div className="flex-1 flex p-6 gap-6 pattern-dots pattern-white pattern-opacity-5 pattern-size-4">
              <div className="w-48 hidden md:flex flex-col gap-3">
                <div className="h-8 w-2/3 bg-white/10 rounded mb-4" />
                <div className="h-6 w-full bg-white/5 rounded" />
                <div className="h-6 w-5/6 bg-white/5 rounded" />
                <div className="h-6 w-4/6 bg-white/5 rounded" />
                <div className="h-6 w-full bg-white/5 rounded" />
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-48 bg-white/10 rounded" />
                  <div className="h-8 w-32 bg-indigo-500/50 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-white/5 rounded-lg border border-white/5" />
                  <div className="h-24 bg-white/5 rounded-lg border border-white/5" />
                  <div className="h-24 bg-white/5 rounded-lg border border-white/5" />
                </div>
                <div className="flex-1 bg-white/5 rounded-lg border border-white/5" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Row */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 relative z-20 text-left">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + (idx * 0.1) }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <Store className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="font-bold text-gray-300">Simplify</span>
          </div>
          <p>© 2024 Simplify Platform. A nova era do varejo digital.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
