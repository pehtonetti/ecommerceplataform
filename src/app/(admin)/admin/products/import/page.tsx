"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { toast } from "sonner";
import { processImportFile, saveImportedProducts } from "@/backend/actions/import-products";

export default function ImportProductsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [step, setStep] = useState<'upload' | 'review' | 'success'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await processImportFile(formData);

            if (result.success && result.data) {
                setParsedData(result.data);
                setStep('review');
                toast.success(`${result.data.length} produtos analisados com sucesso!`);
            } else {
                toast.error("Erro ao analisar arquivo: " + result.error);
            }
        } catch {
            toast.error("Erro inesperado ao processar arquivo.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await saveImportedProducts(parsedData);
            if (res.success) {
                setStep('success');
                toast.success("Produtos importados com sucesso!");
            } else {
                toast.error("Erro ao salvar: " + res.error);
            }
        } catch {
            toast.error("Erro ao salvar produtos.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-2">Importação em Massa de Produtos</h1>
            <p className="text-gray-500 mb-8">Carregue uma planilha Excel (.xlsx) para cadastrar múltiplos produtos automaticamente com auxílio de IA.</p>

            {step === 'upload' && (
                <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-12 text-center bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 transition-colors">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Arraste e solte sua planilha aqui</h3>
                    <p className="text-gray-500 mb-6">Ou</p>

                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="lg">
                        Selecionar Arquivo
                    </Button>

                    {file && (
                        <div className="mt-8 p-4 bg-white dark:bg-zinc-800 rounded-lg inline-flex items-center gap-4 shadow-sm">
                            <FileText className="w-8 h-8 text-green-600" />
                            <div className="text-left">
                                <p className="font-bold">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="ml-4">
                                {isAnalyzing ? <Loader2 className="animate-spin" /> : "Analisar com IA"}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {step === 'review' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Revisão dos Dados ({parsedData.length} itens)</h2>
                        <Button onClick={handleSave} disabled={isSaving} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2 w-5 h-5" />}
                            Confirmar Importação
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-zinc-950 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Nome</th>
                                        <th className="px-4 py-3 text-left">Preço</th>
                                        <th className="px-4 py-3 text-left">Estoque</th>
                                        <th className="px-4 py-3 text-left">Categoria (IA)</th>
                                        <th className="px-4 py-3 text-left">Descrição Gerada (IA)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.map((prod, idx) => (
                                        <tr key={idx} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                                            <td className="px-4 py-3 font-medium">{prod.name}</td>
                                            <td className="px-4 py-3">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price / 100)}
                                            </td>
                                            <td className="px-4 py-3">{prod.stock}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-bold">
                                                    {prod.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate text-gray-500">
                                                {prod.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {step === 'success' && (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Importação Concluída!</h2>
                    <p className="text-gray-500 mb-8">Todos os produtos foram cadastrados com sucesso no banco de dados.</p>
                    <Button onClick={() => setStep('upload')} variant="outline">
                        Importar Mais
                    </Button>
                </div>
            )}
        </div>
    );
}
