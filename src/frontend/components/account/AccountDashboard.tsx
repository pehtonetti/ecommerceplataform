'use client';

import { useState } from 'react';
import {
    User, MapPin, Settings, Shield, FileText, CreditCard,
    Package, Heart, Gift, MessageCircle, ShoppingCart,
    Lock, Share2, LogOut, ChevronRight, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalInfo } from './sections/PersonalInfo';
import { Addresses } from './sections/Addresses';
import { Preferences } from './sections/Preferences';
import { Security } from './sections/Security';
import { Fiscal } from './sections/Fiscal';
import { Payments } from './sections/Payments';
import { Orders } from './sections/Orders';
import { Wishlist } from './sections/Wishlist';
import { Benefits } from './sections/Benefits';
import { Support } from './sections/Support';
import { CartPreview } from './sections/CartPreview';
import { Privacy } from './sections/Privacy';
import { Integrations } from './sections/Integrations';
import { logout } from '@/backend/actions/auth-actions';

interface AccountDashboardProps {
    user: any;
    orders: any[];
}

export function AccountDashboard({ user, orders }: AccountDashboardProps) {
    const [activeTab, setActiveTab] = useState('personal');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'personal', label: 'Informações Pessoais', icon: User, category: 'Perfil' },
        { id: 'addresses', label: 'Endereços', icon: MapPin, category: 'Perfil' },
        { id: 'preferences', label: 'Preferências', icon: Settings, category: 'Perfil' },
        { id: 'security', label: 'Segurança e Autenticação', icon: Shield, category: 'Segurança' },
        { id: 'fiscal', label: 'Dados Fiscais', icon: FileText, category: 'Financeiro' },
        { id: 'payments', label: 'Pagamentos', icon: CreditCard, category: 'Financeiro' },
        { id: 'orders', label: 'Histórico de Pedidos', icon: Package, category: 'Atividade' },
        { id: 'wishlist', label: 'Lista de Desejos', icon: Heart, category: 'Atividade' },
        // { id: 'benefits', label: 'Cupons e Benefícios', icon: Gift, category: 'Atividade' },
        { id: 'support', label: 'Suporte e Atividades', icon: MessageCircle, category: 'Atividade' },
        { id: 'cart', label: 'Carrinho & Navegação', icon: ShoppingCart, category: 'Atividade' },
        { id: 'privacy', label: 'Privacidade & LGPD', icon: Lock, category: 'Legal' },
        { id: 'integrations', label: 'Integrações Externas', icon: Share2, category: 'Legal' },
    ];

    const handleLogout = async () => {
        await logout();
    };

    const categories = Array.from(new Set(menuItems.map(item => item.category)));

    const renderContent = () => {
        switch (activeTab) {
            case 'personal': return <PersonalInfo user={user} />;
            case 'addresses': return <Addresses user={user} />;
            case 'preferences': return <Preferences user={user} />;
            case 'security': return <Security user={user} />;
            case 'fiscal': return <Fiscal user={user} />;
            case 'payments': return <Payments user={user} />;
            case 'orders': return <Orders orders={orders} />;
            case 'wishlist': return <Wishlist />;
            case 'benefits': return <Benefits user={user} />;
            case 'support': return <Support />;
            case 'cart': return <CartPreview />;
            case 'privacy': return <Privacy />;
            case 'integrations': return <Integrations />;
            default: return <PersonalInfo user={user} />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between p-4 glass rounded-xl border border-white/20 text-left"
                >
                    <span className="font-semibold flex items-center gap-2">
                        <Menu className="w-5 h-5" />
                        Menu da Conta
                    </span>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
        lg:w-80 flex-shrink-0 space-y-6 
        ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}
      `}>
                <div className="glass rounded-2xl border border-white/20 overflow-hidden sticky top-24">
                    <div className="p-6 border-b border-white/10 dark:border-white/5 bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {user.name?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{user.name || 'Cliente'}</h2>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Conta Verificada</p>
                            </div>
                        </div>
                    </div>

                    <nav className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                        {categories.map(category => (
                            <div key={category}>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                                    {category}
                                </h3>
                                <div className="space-y-1">
                                    {menuItems.filter(item => item.category === category).map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${activeTab === item.id
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                                }
                      `}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair da Conta
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
