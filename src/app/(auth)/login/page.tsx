'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/backend/actions/auth-actions';
import { Mail, Lock, Eye, EyeOff, Loader2, ChevronRight } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-screen w-full bg-[#010715] relative overflow-hidden py-12 px-4">
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

            <div className="w-full max-w-xl relative z-10 px-4">
                {/* Modern Dark Glassmorphism - NO WHITE BORDERS */}
                <div className="bg-black/40 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                    {/* Integrated Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex flex-col items-center gap-2 mb-2">
                            <div className="w-16 h-16 bg-white/90 dark:bg-zinc-800 rounded-2xl shadow-lg flex items-center justify-center backdrop-blur-sm p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent drop-shadow-sm">Simplify</span>
                        </Link>
                        <h1 className="text-4xl font-semibold mt-6 text-white tracking-tight">
                            Entrar
                        </h1>
                        <p className="text-zinc-400 mt-3 text-lg">
                            Use seu ID Simplify para continuar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3 ml-1">
                                Endereço de E-mail
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all font-medium text-white placeholder:text-zinc-600"
                                    placeholder="seu@email.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-3 ml-1">
                                <label htmlFor="password" className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                                    Senha
                                </label>
                                <Link href="/forgot-password" className={`text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                                    Esqueceu?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    required
                                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-white/10 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all font-medium text-white"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        {/* Submit Button - Apple Style */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${success ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/10'}`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                success ? 'Pronto!' : 'Entrar'
                            )}
                        </button>


                    </form>

                    {/* Register Section - Minimalist & High Impact */}
                    <div className="mt-16 text-center pt-10 border-t border-white/10">
                        <p className="text-white text-xl font-medium mb-6">
                            Não tem um ID Simplify?
                        </p>
                        <Link
                            href="/register"
                            className="text-indigo-400 font-bold text-lg hover:text-white transition-colors flex items-center justify-center gap-2 group"
                        >
                            <span>Crie o seu agora</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>



                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2">
                        ← Voltar para a loja
                    </Link>
                </div>
            </div>
        </div>
    );
}
