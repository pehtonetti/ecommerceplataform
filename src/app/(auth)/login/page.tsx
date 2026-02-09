'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/backend/actions/auth-actions';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const searchParams = useSearchParams();
    const redirectUrlParam = searchParams.get('redirect');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.success) {
            setSuccess('Login realizado com sucesso! Redirecionando...');
            // Wait for animation
            setTimeout(() => {
                window.location.href = redirectUrlParam || result.redirectUrl || '/';
            }, 1000);
        }
    };

    return (
        // Premium Background with Vignette Effect
        <div className="flex items-center justify-center p-4 min-h-screen w-full fixed inset-0 bg-[#010715] overflow-hidden">
            {/* Force body background to prevent white flashes or margins */}
            <style jsx global>{`
                body { background-color: #010715 !important; }
            `}</style>

            {/* Centered Image with seamless blend */}
            <div
                className="absolute inset-0 z-0 bg-center bg-no-repeat opacity-100 pointer-events-none"
                style={{
                    backgroundImage: "url('/images/login-bg-v5.png')",
                    backgroundSize: 'cover',
                    // The mask makes the edges of the image fade into the #010715 background
                    maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)"
                }}
            />

            {/* Simulated Animated LEDs (Coming from Door) */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
                {/* Left Wall Beams */}
                <div className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[2px] animate-tunnel" style={{ transformOrigin: 'center bottom', transform: 'rotate(-45deg)', animationDelay: '0s', left: '35%' }}></div>
                <div className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[2px] animate-tunnel" style={{ transformOrigin: 'center bottom', transform: 'rotate(-45deg)', animationDelay: '1.5s', left: '35%' }}></div>

                {/* Right Wall Beams */}
                <div className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[2px] animate-tunnel" style={{ transformOrigin: 'center bottom', transform: 'rotate(45deg)', animationDelay: '0.5s', right: '35%' }}></div>
                <div className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[2px] animate-tunnel" style={{ transformOrigin: 'center bottom', transform: 'rotate(45deg)', animationDelay: '2s', right: '35%' }}></div>

                {/* Top Arch Beams */}
                <div className="absolute w-[30vh] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[2px] animate-tunnel" style={{ top: '35%', animationDelay: '0.2s' }}></div>

                {/* Floor Reflection Beams */}
                <div className="absolute w-[30vh] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[4px] opacity-30 animate-tunnel" style={{ bottom: '35%', animationDelay: '0.7s' }}></div>
            </div>

            {/* Notification Box */}
            {(error || success) && (
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border animate-in fade-in slide-in-from-bottom-8 duration-500 flex items-center gap-3 ${success
                    ? 'bg-green-500/90 text-white border-green-400'
                    : 'bg-red-500/90 text-white border-red-400'
                    }`}>
                    {success ? (
                        <div className="p-1 bg-white/20 rounded-full">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ) : (
                        <div className="p-1 bg-white/20 rounded-full">
                            <Lock className="w-5 h-5" />
                        </div>
                    )}
                    <div>
                        <h4 className="font-bold text-sm">{success ? 'Sucesso!' : 'Atenção'}</h4>
                        <p className="text-sm opacity-90">{success || error}</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md relative z-10 scale-[0.8] origin-center">
                {/* Login Form with iOS Glass Effect */}
                <div className="glass-ios rounded-3xl p-8 backdrop-saturate-150">
                    {/* Integrated Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex flex-col items-center gap-2 mb-2">
                            <div className="w-16 h-16 bg-white/90 dark:bg-zinc-800 rounded-2xl shadow-lg flex items-center justify-center backdrop-blur-sm p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent drop-shadow-sm">Simplify</span>
                        </Link>
                        <h1 className="text-3xl font-bold mt-4 text-slate-900 dark:text-white tracking-tight">Bem-vindo de Volta</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
                            Entre para acessar sua conta
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    placeholder="seu@email.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label htmlFor="password" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    Senha
                                </label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline">
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    required
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/80 dark:focus:bg-black/40 transition-all font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${success ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {success ? 'Entrando...' : 'Verificando...'}
                                </>
                            ) : (
                                success ? 'Redirecionando...' : 'Entrar na Conta'
                            )}
                        </button>

                        {/* Social Login Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200/60 dark:border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#f8faff] dark:bg-[#0c0c0e] px-4 text-slate-500 font-bold tracking-widest">Ou continue com</span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-1 gap-4">
                            <button type="button" className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-all font-bold text-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                Google
                            </button>
                        </div>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center pt-6 border-t border-slate-200/60 dark:border-white/10">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Ainda não tem conta?{' '}
                            <Link href="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline">
                                Criar conta grátis
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Quick Access */}
                <div className="mt-6 p-4 glass-ios rounded-xl border border-white/30 dark:border-white/10">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 text-center">
                        🚀 Acesso Rápido (Dev)
                    </p>
                    <div className="flex justify-between items-center text-xs">
                        <div className="text-center w-1/2 border-r border-slate-200/50 dark:border-white/10 pr-2">
                            <span className="block font-semibold text-slate-500 text-[10px] mb-1">ADMIN</span>
                            <code className="bg-slate-100 dark:bg-black/30 px-2 py-1 rounded text-slate-800 dark:text-slate-200 font-mono">admin@loja.com</code>
                            <span className="block text-[10px] bg-slate-100 dark:bg-black/30 rounded mt-1 w-fit mx-auto px-2">123</span>
                        </div>
                        <div className="text-center w-1/2 pl-2">
                            <span className="block font-semibold text-slate-500 text-[10px] mb-1">CLIENTE</span>
                            <code className="bg-slate-100 dark:bg-black/30 px-2 py-1 rounded text-slate-800 dark:text-slate-200 font-mono">joao@email.com</code>
                            <span className="block text-[10px] bg-slate-100 dark:bg-black/30 rounded mt-1 w-fit mx-auto px-2">123</span>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                        ← Voltar para a loja
                    </Link>
                </div>
            </div>
        </div>
    );
}
