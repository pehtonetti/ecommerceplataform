'use client';

import { useState } from 'react';
import { sendContactMessage } from '@/backend/actions/contact-actions';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await sendContactMessage(formData);

        setIsSubmitting(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            e.currentTarget.reset();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nome Completo *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="João Silva"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        E-mail *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="joao@email.com"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Assunto *
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Como posso ajudar?"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensagem *
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:opacity-90 px-8 py-3 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Enviar Mensagem
                    </>
                )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
                Ao enviar esta mensagem, você concorda com nossa{' '}
                <a href="/privacy" className="text-primary hover:underline">
                    Política de Privacidade
                </a>.
            </p>
        </form>
    );
}
