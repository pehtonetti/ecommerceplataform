"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, LogIn } from "lucide-react";

export default function HomePage() {
  const [ip, setIp] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Public IP (falls back to unavailable on error)
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp("Unavailable"));

    // Read cart from localStorage (example key: "cart")
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const items = JSON.parse(raw);
        setCartCount(Array.isArray(items) ? items.length : 0);
      }
    } catch (e) {
      setCartCount(0);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        try {
          const items = e.newValue ? JSON.parse(e.newValue) : [];
          setCartCount(Array.isArray(items) ? items.length : 0);
        } catch {
          setCartCount(0);
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-12">
      <div className="w-full max-w-6xl flex justify-end mb-8 gap-3">
        <Link href="/cart" className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass border border-white/10 hover:opacity-90">
          <ShoppingCart className="w-5 h-5" />
          <span>Carrinho{cartCount > 0 ? ` (${cartCount})` : ""}</span>
        </Link>
        <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass border border-white/10 hover:opacity-90">
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-green-500 mb-4">Conexão Estabelecida! 🚀</h1>
      <p className="text-xl text-muted-foreground">
        Se você está lendo isso, o bloqueio do Windows foi contornado com sucesso.
      </p>

      <div className="mt-8 p-4 rounded-lg glass border border-white/10 w-full max-w-md text-center">
        <p className="font-mono text-sm text-muted-foreground">Status: Online</p>
        <p className="font-mono text-sm text-muted-foreground">Porta: 5000</p>
        <p className="font-mono text-sm text-muted-foreground mt-2">Endereço IP: {ip ?? 'Carregando...'}</p>
      </div>
    </div>
  );
}
