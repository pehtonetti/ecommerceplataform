'use client';

import { useState, useRef } from 'react';
import { User, Smartphone, Mail, Calendar, Hash, BadgeCheck, Shield, UploadCloud } from 'lucide-react';
import { uploadUserAvatar } from '@/backend/actions/user-actions';
import { toast } from 'sonner';

interface PersonalInfoProps {
    user: any;
}

export function PersonalInfo({ user }: PersonalInfoProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('O tamanho máximo é 2MB.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await uploadUserAvatar(formData);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success('Foto de perfil atualizada!');
            }
        } catch (error) {
            toast.error('Erro ao enviar imagem.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Informações Pessoais
                    </h2>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium border border-green-200 dark:border-green-800 flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Ativo
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Foto de Perfil */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 relative">
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                        />
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-4 relative group cursor-pointer overflow-hidden border-4 border-white dark:border-zinc-800"
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.name?.charAt(0) || 'U'
                            )}
                            
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {isUploading ? (
                                    <span className="text-xs font-medium animate-pulse">Enviando...</span>
                                ) : (
                                    <>
                                        <UploadCloud className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-medium">Alterar</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Clique para alterar sua foto de perfil.<br />
                            <span className="text-xs opacity-70">JPG ou PNG até 2MB.</span>
                        </p>
                    </div>

                    {/* Dados Básicos */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ID do Cliente</label>
                            <div className="flex items-center gap-2 mt-1 font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-black/20 p-2 rounded border border-gray-200 dark:border-white/10">
                                <Hash className="w-4 h-4 text-gray-400" />
                                {user.id}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Completo</label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Social</label>
                                <input
                                    type="text"
                                    placeholder="Opcional"
                                    className="w-full mt-1 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gênero</label>
                                <select className="w-full mt-1 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Selecione</option>
                                    <option value="m">Masculino</option>
                                    <option value="f">Feminino</option>
                                    <option value="nb">Não-binário</option>
                                    <option value="o">Outro</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Dados Sensíveis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF / CNPJ</label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-xs">DOC</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="000.000.000-00"
                                    className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Data de Nascimento</label>
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado Civil</label>
                            <select className="w-full mt-1 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="">Selecione</option>
                                <option value="single">Solteiro(a)</option>
                                <option value="married">Casado(a)</option>
                                <option value="divorced">Divorciado(a)</option>
                                <option value="widowed">Viúvo(a)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-500" />
                        Contato
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">E-mail Principal</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <BadgeCheck className="w-4 h-4 text-green-500" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone Principal</label>
                            <div className="flex gap-2 mt-1">
                                <select className="w-20 px-2 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg outline-none">
                                    <option>+55</option>
                                </select>
                                <input
                                    type="tel"
                                    placeholder="(11) 99999-9999"
                                    className="flex-1 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        Cancelar
                    </button>
                    <button className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
