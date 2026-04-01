'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerStore } from '@/backend/actions/merchant-actions';
import Link from 'next/link';

export default function RegisterStorePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    
    // Form States
    const [storeName, setStoreName] = useState('');
    const [slug, setSlug] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStoreName(e.target.value);
        if (step === 1) {
            setSlug(generateSlug(e.target.value));
        }
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && storeName && slug) {
            setStep(2);
        } else if (step === 2 && ownerName && email && password) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('storeName', storeName);
        formData.append('slug', slug);
        formData.append('ownerName', ownerName);
        formData.append('email', email);
        formData.append('password', password);

        const result = await registerStore(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else if (result?.success) {
            // Em caso de sucesso, direcionar para login para que o cookie seja setado via login!
            router.push(result.redirectUrl || '/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black font-sans p-4">
            <div className="bg-white dark:bg-zinc-950 p-10 rounded-3xl shadow-2xl dark:border dark:border-white/10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Simplify</h1>
                    <p className="text-gray-500 dark:text-gray-400">A plataforma para a sua loja decolar.</p>
                    <div className="flex justify-center gap-2 mt-6">
                        <div className={`h-1.5 w-10 rounded-full transition-all duration-300 ${step === 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-800'}`} />
                        <div className={`h-1.5 w-10 rounded-full transition-all duration-300 ${step === 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-800'}`} />
                    </div>
                </div>

                {error && (
                    <div className="p-3 mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleNextStep} className="flex flex-col gap-5">
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome da Loja</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Minha Super Loja" 
                                    value={storeName}
                                    onChange={handleNameChange}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL da Loja na Simplify</label>
                                <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all bg-gray-50 dark:bg-zinc-900">
                                    <input 
                                        required
                                        type="text" 
                                        value={slug}
                                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                                        className="w-full p-3 bg-transparent text-gray-900 dark:text-white outline-none"
                                        placeholder="minhaloja"
                                    />
                                    <span className="px-3 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-sm border-l border-gray-200 dark:border-zinc-700 h-full flex items-center">
                                        .simplify.com.br
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Você poderá configurar um domínio próprio depois.</p>
                            </div>

                            <button type="submit" className="w-full p-3 mt-4 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98] transition-all">
                                Continuar
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Seu Nome</label>
                                <input 
                                    required type="text" placeholder="João Silva" value={ownerName} onChange={(e) => setOwnerName(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail de Login</label>
                                <input 
                                    required type="email" placeholder="joao@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Senha de Lojista</label>
                                <input 
                                    required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={() => setStep(1)} disabled={loading} className="flex-1 p-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all">
                                    Voltar
                                </button>
                                <button type="submit" disabled={loading} className="flex-[2] p-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? 'Criando Loja...' : 'Criar minha Loja'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                Apenas R$ 5,00/mês nos primeiros 30 dias.
                            </p>
                        </>
                    )}
                </form>

                <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                    Já é um Lojista Simplify?{' '}
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Faça login
                    </Link>
                </div>
            </div>
        </div>
    );
}
