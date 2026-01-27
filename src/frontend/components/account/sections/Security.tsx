'use client';

import { Shield, Key, Smartphone, AlertTriangle, Monitor, Lock, History } from 'lucide-react';

interface SecurityProps {
    user: any;
}

export function Security({ user }: SecurityProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Segurança da Conta
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Protegida
                </span>
            </div>

            {/* Senha e 2FA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 border border-white/20">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                <Key className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Senha</h3>
                                <p className="text-xs text-gray-500">Última alteração: 30 dias atrás</p>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Alterar</button>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-mono bg-gray-50 dark:bg-black/20 p-2 rounded text-gray-500 truncate">
                            ••••••••••••••••
                        </p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Sua senha atende aos requisitos de segurança.
                        </p>
                    </div>
                </div>

                <div className="glass p-6 border border-white/20">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Autenticação 2FA</h3>
                                <p className="text-xs text-gray-500">Proteção extra para sua conta</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" />
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Recomendamos ativar a verificação em duas etapas para proteger sua conta contra acessos não autorizados.
                    </p>
                    <div className="flex gap-2">
                        <button className="flex-1 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50">
                            App Autenticador
                        </button>
                        <button className="flex-1 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5">
                            SMS
                        </button>
                    </div>
                </div>
            </div>

            {/* Dispositivos e Histórico */}
            <div className="glass p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-gray-500" />
                    Sessões Ativas e Dispositivos
                </h3>

                <div className="space-y-4">
                    {[
                        { device: 'Windows PC (Chrome)', location: 'São Paulo, BR', time: 'Ativo agora', current: true, icon: Monitor },
                        { device: 'iPhone 13 (App)', location: 'São Paulo, BR', time: 'Há 2 horas', current: false, icon: Smartphone },
                    ].map((session, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-gray-500">
                                    <session.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                        {session.device}
                                        {session.current && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full">Atual</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">{session.location} • {session.time}</p>
                                </div>
                            </div>
                            {!session.current && (
                                <button className="text-xs text-red-600 hover:text-red-700 font-medium">Desconectar</button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-center">
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2 mx-auto">
                        <AlertTriangle className="w-4 h-4" />
                        Encerrar todas as outras sessões
                    </button>
                </div>
            </div>

            {/* Histórico Recente */}
            <div className="overflow-hidden glass rounded-xl border border-white/20">
                <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Histórico de Segurança</h3>
                    <History className="w-4 h-4 text-gray-400" />
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5">
                        <tr>
                            <th className="px-6 py-3">Ação</th>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">IP</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {[
                            { action: 'Login realizado', date: 'Hoje, 10:23', ip: '192.168.1.1', status: 'Sucesso' },
                            { action: 'Alteração de senha', date: '12 Dez 2024', ip: '192.168.1.1', status: 'Sucesso' },
                            { action: 'Tentativa de login falha', date: '10 Dez 2024', ip: '200.100.50.25', status: 'Bloqueado', danger: true },
                        ].map((log, idx) => (
                            <tr key={idx} className="bg-white/0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium">{log.action}</td>
                                <td className="px-6 py-4 text-gray-500">{log.date}</td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-400">{log.ip}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.danger ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
