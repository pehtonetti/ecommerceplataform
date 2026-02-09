"use client";

import Link from "next/link";
import { FadeIn } from "./ui/Motion";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, CreditCard, ArrowRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-zinc-800 mt-20">
            <div className="bg-zinc-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Fique por dentro das novidades</h3>
                            <p className="text-zinc-400 text-sm">Receba ofertas exclusivas e descontos em primeira mão.</p>
                        </div>
                        <div className="flex w-full max-w-md gap-2">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
                            />
                            <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                                Assinar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <FadeIn>
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="space-y-4">
                            <Link href="/" className="inline-block">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center p-1.5">
                                        <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tighter">S-Commerce</h3>
                                </div>
                            </Link>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                A sua loja de tecnologia preferida. Produtos premium, entrega rápida e o melhor suporte do mercado.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" />
                                <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
                                <SocialLink icon={<Facebook className="w-5 h-5" />} href="#" />
                            </div>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground">Navegação</h4>
                            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                <FooterLink href="/search">Início</FooterLink>
                                <FooterLink href="/search?sort=bestselling">Mais Vendidos</FooterLink>
                                <FooterLink href="/search?sort=newest">Lançamentos</FooterLink>
                                <FooterLink href="/about">Sobre Nós</FooterLink>
                                <FooterLink href="/blog">Blog</FooterLink>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground">Ajuda</h4>
                            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                <FooterLink href="/account">Minha Conta</FooterLink>
                                <FooterLink href="/orders">Meus Pedidos</FooterLink>
                                <FooterLink href="/contact">Fale Conosco</FooterLink>
                                <FooterLink href="/shipping">Frete e Entregas</FooterLink>
                                <FooterLink href="/returns">Trocas e Devoluções</FooterLink>
                            </ul>
                        </div>

                        {/* Contact & Payments */}
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground">Atendimento</h4>
                            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium mb-8">
                                <li className="flex items-center gap-3">
                                    <Phone className="w-4 h-4" />
                                    (11) 99999-9999
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-4 h-4" />
                                    suporte@loja.com
                                </li>
                                <li className="flex items-center gap-3">
                                    <ClockIcon className="w-4 h-4" />
                                    Seg - Sex, 9h às 18h
                                </li>
                            </ul>

                            <h4 className="font-bold mb-4 text-xs uppercase tracking-wider text-foreground">Pagamento</h4>
                            <div className="flex gap-2 text-zinc-600 dark:text-zinc-400">
                                <CreditCard className="w-8 h-8" />
                                <div className="w-8 h-8 border border-zinc-300 dark:border-zinc-700 rounded flex items-center justify-center font-bold text-xs">PIX</div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} LOJA. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-foreground">Privacidade</Link>
                            <Link href="/terms" className="hover:text-foreground">Termos de Uso</Link>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </footer>
    );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <Link href={href} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black transition-all duration-300">
            {icon}
        </Link>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-primary transition-colors hover:pl-2 duration-300 flex items-center gap-2 group">
                <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary">
                    <ArrowRight className="w-3 h-3" />
                </span>
                {children}
            </Link>
        </li>
    );
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
