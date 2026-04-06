'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '@/backend/actions/register-actions';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await register(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.success) {
            window.location.href = '/login?registered=true';
        }
    };

    return (
        <div className="flex items-center justify-center p-4 min-h-screen w-full fixed inset-0 bg-[#010715] overflow-hidden">
            <style jsx global>{`
                body { background-color: #010715 !important; }
            `}</style>

            {/* Centered Image with seamless blend */}
            <div
                className="absolute inset-0 z-0 bg-center bg-no-repeat opacity-100 pointer-events-none"
                style={{
                    backgroundImage: "url('/images/login-bg-v5.png')",
                    backgroundSize: 'cover',
                    maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)"
                }}
            />

            {/* Simulated Animated LEDs (Coming from Door) */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[2px] animate-tunnel" style={{ transformOrigin: 'center bottom', transform: 'rotate(-45deg)', animationDelay: '0s', left: '35%' }}></div>
                <div className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[2px] animate-tunnel" style={{ transformOrigin: 'center bottom', transform: 'rotate(45deg)', animationDelay: '0.5s', right: '35%' }}></div>
                <div className="absolute w-[30vh] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[2px] animate-tunnel" style={{ top: '35%', animationDelay: '0.2s' }}></div>
            </div>

            {/* Notification Box */}
            {error && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-red-400 bg-red-500/90 text-white animate-in fade-in slide-in-from-bottom-8 duration-500 flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-full">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Atenção</h4>
                        <p className="text-sm opacity-90">{error}</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-xl relative z-10 scale-[0.8] origin-center">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex flex-col items-center gap-2 mb-2">
                        <div className="w-16 h-16 bg-white/90 dark:bg-zinc-800 rounded-2xl shadow-lg flex items-center justify-center backdrop-blur-sm p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent drop-shadow-sm">Simplify</span>
                    </Link>
                    <h1 className="text-3xl font-bold mt-4 text-slate-900 dark:text-white tracking-tight">Criar Conta Nova</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
                        Preencha seus dados para começar
                    </p>
                </div>

                {/* Register Form */}
                <div className="glass-ios rounded-3xl p-8 backdrop-saturate-150">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Nome Completo
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/80 dark:focus:bg-black/40 transition-all font-medium placeholder:text-slate-400"
                                    placeholder="João Silva"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                E-mail
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/80 dark:focus:bg-black/40 transition-all font-medium placeholder:text-slate-400"
                                    placeholder="joao@email.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Senha
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        required
                                        minLength={6}
                                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/80 dark:focus:bg-black/40 transition-all font-medium placeholder:text-slate-400"
                                        placeholder="Min 6 caracteres"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Confirmar
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        required
                                        minLength={6}
                                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/80 dark:focus:bg-black/40 transition-all font-medium placeholder:text-slate-400"
                                        placeholder="Repita a senha"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                'Criar Minha Conta'
                            )}
                        </button>

                        {/* Terms */}
                        <div className="text-center text-xs text-slate-500 dark:text-slate-500 mt-4">
                            Ao criar conta, você concorda com nossos{' '}
                            <Link href="/terms" className="text-indigo-600 hover:underline">Termos</Link> e{' '}
                            <Link href="/privacy" className="text-indigo-600 hover:underline">Privacidade</Link>.
                        </div>
                    </form>

                    {/* Back Link */}
                    <div className="mt-6 text-center pt-6 border-t border-slate-200/60 dark:border-white/10">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Já possui uma conta?{' '}
                            <Link href="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline">
                                Fazer Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
