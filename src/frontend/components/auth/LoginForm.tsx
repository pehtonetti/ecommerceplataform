'use client';

import { useState } from 'react';
import { login } from '@/backend/actions/auth-actions';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Loader2, ArrowRight, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError('');

        try {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
            // If successful, the action redirects, so we don't need to unset loading immediately
        } catch (e) {
            setError('Ocorreu um erro ao tentar entrar.');
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900/50 flex items-center justify-center font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            placeholder="seu@email.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            required
                            className="pl-9 h-11 bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Senha
                        </label>
                        <a href="#" className="text-xs font-medium text-primary hover:text-primary/80">Esqueceu?</a>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            required
                            className="pl-9 h-11 bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <Button className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" type="submit" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <>
                        Entrar na conta
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>

            {/* Dev Helper - Remove in Prod */}
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-zinc-800 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Contas de Teste (Seed):</p>
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={(e) => {
                        const form = e.currentTarget.closest('form');
                        if (form) {
                            (form.querySelector('#email') as HTMLInputElement).value = 'admin@loja.com';
                            (form.querySelector('#password') as HTMLInputElement).value = '123';
                        }
                    }} className="text-left hover:text-primary">Admin: admin@loja.com</button>
                    <button type="button" onClick={(e) => {
                        const form = e.currentTarget.closest('form');
                        if (form) {
                            (form.querySelector('#email') as HTMLInputElement).value = 'vip@cliente.com';
                            (form.querySelector('#password') as HTMLInputElement).value = '123';
                        }
                    }} className="text-left hover:text-primary">Cliente: vip@cliente.com</button>
                    <span className="col-span-2 text-center text-[10px] opacity-70">Senha padrão: 123</span>
                </div>
            </div>
        </form>
    );
}
