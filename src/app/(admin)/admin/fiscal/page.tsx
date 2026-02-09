"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { FileText, Save, Loader2, Upload, Download, Trash2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function FiscalPage() {
    const [loading, setLoading] = useState(false);

    // MOCK DATA for invoices
    const [invoices, setInvoices] = useState([
        { id: '1', number: '001', series: '1', date: '18/12/2024', customer: 'João Silva', value: 1250.00, status: 'authorized' },
        { id: '2', number: '002', series: '1', date: '18/12/2024', customer: 'Maria Oliveira', value: 890.50, status: 'processing' },
        { id: '3', number: '003', series: '1', date: '17/12/2024', customer: 'Empresa XYZ', value: 4500.00, status: 'error' },
        { id: '4', number: '004', series: '1', date: '17/12/2024', customer: 'Carlos Pereira', value: 120.00, status: 'authorized' },
    ]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        toast.success("Configurações e Certificado salvos com sucesso!");
        setLoading(false);
    };

    const handleEmit = (invoiceId: string) => {
        toast.loading("Transmitindo NFe para SEFAZ...", { duration: 2000 });
        setTimeout(() => {
            setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'authorized' } : inv));
            toast.success("Nota Fiscal Autorizada!");
        }, 2000);
    };

    const handleCancel = (invoiceId: string) => {
        if (!confirm("Deseja realmente cancelar esta NFe?")) return;
        toast.loading("Cancelando NFe...", { duration: 2000 });
        setTimeout(() => {
            setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'canceled' } : inv));
            toast.success("Nota Fiscal Cancelada!");
        }, 2000);
    };

    const handleSelectFile = () => {
        // Trigger file input dialog (simulated)
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pfx,.p12';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) toast.success(`Certificado selecionado: ${file.name}`);
        };
        input.click();
    };

    return (
        <div className="space-y-8 pb-20">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Fiscal (NFe)</h1>
                        <p className="text-muted-foreground">Gerenciamento de notas fiscais e certificado digital.</p>
                    </div>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* CONFIGURATION & CERTIFICATE */}
                <FadeIn delay={0.1} className="xl:col-span-1">
                    <form onSubmit={handleSave} className="glass p-6 rounded-xl border border-border space-y-6 sticky top-8">
                        <div className="flex items-center gap-3 pb-4 border-b border-border">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Configuração</h2>
                                <p className="text-xs text-muted-foreground">Dados do emitente e certificado.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CNPJ</label>
                                <Input placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-99" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Inscrição Estadual</label>
                                <Input placeholder="000.000.000.000" defaultValue="123.456.789.000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Regime Tributário</label>
                                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                    <option value="simples">Simples Nacional</option>
                                    <option value="lucro_presumido">Lucro Presumido</option>
                                    <option value="lucro_real">Lucro Real</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <h3 className="font-medium text-sm">Certificado Digital (A1)</h3>

                            <div
                                onClick={handleSelectFile}
                                className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                            >
                                <Upload className="w-6 h-6 text-muted-foreground" />
                                <div className="text-center">
                                    <p className="text-sm font-medium">Carregar Certificado</p>
                                    <p className="text-xs text-muted-foreground">Extensões .pfx ou .p12</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Senha do Certificado</label>
                                <Input type="password" placeholder="******" />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Salvar Configurações
                        </Button>
                    </form>
                </FadeIn>

                {/* INVOICE LIST */}
                <FadeIn delay={0.2} className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Emissões Recentes</h2>
                        <div className="flex gap-2">
                            <Input placeholder="Buscar por número ou cliente..." className="w-64" />
                            <Button variant="outline">Filtros</Button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-zinc-900">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr>
                                    <th className="p-4 text-left">Nota</th>
                                    <th className="p-4 text-left">Emissão</th>
                                    <th className="p-4 text-left">Cliente</th>
                                    <th className="p-4 text-left">Valor</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {invoices.map(invoice => (
                                    <tr key={invoice.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="p-4 font-medium">
                                            #{invoice.number} <span className="text-xs text-muted-foreground ml-1">Série {invoice.series}</span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{invoice.date}</td>
                                        <td className="p-4">{invoice.customer}</td>
                                        <td className="p-4 font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.value)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {invoice.status === 'authorized' && <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"><CheckCircle className="w-3 h-3 mr-1" /> Autorizada</span>}
                                            {invoice.status === 'processing' && <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold"><Clock className="w-3 h-3 mr-1" /> Processando</span>}
                                            {invoice.status === 'error' && <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold"><AlertCircle className="w-3 h-3 mr-1" /> Erro</span>}
                                            {invoice.status === 'canceled' && <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">Cancelada</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {invoice.status === 'error' || invoice.status === 'processing' ? (
                                                    <Button size="sm" variant="outline" onClick={() => handleEmit(invoice.id)}>Reenviar</Button>
                                                ) : (
                                                    <>
                                                        <Button size="sm" variant="ghost" title="Baixar XML/PDF">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                        {invoice.status !== 'canceled' && (
                                                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleCancel(invoice.id)} title="Cancelar">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
