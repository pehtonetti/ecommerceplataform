'use client';

import { useState } from 'react';
import { emitNfe } from '@/backend/actions/fiscal-actions';
import { Button } from '@/frontend/components/ui/Button';
import { toast } from 'sonner';
import { FileText, Loader2, Download, CheckCircle, AlertTriangle } from 'lucide-react';

interface AdminOrderActionsProps {
    orderId: string;
    invoices: any[]; // Using any[] to avoid complex import types for now, ideally Invoice[]
    orderStatus: string;
}

export function AdminOrderActions({ orderId, invoices, orderStatus }: AdminOrderActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleEmitNfe = async () => {
        setIsLoading(true);
        try {
            const result = await emitNfe(orderId);
            if (result.success) {
                toast.success('Nota Fiscal emitida com sucesso!');
                // In a real app, we would refresh the page or update local state
                window.location.reload();
            } else {
                toast.error('Erro ao emitir NFe: ' + result.error);
            }
        } catch (error) {
            toast.error('Erro desconhecido ao emitir NFe');
        } finally {
            setIsLoading(false);
        }
    };

    const hasInvoice = invoices && invoices.length > 0;
    const invoice = hasInvoice ? invoices[0] : null;

    return (
        <div className="glass rounded-xl border border-border p-6 space-y-6">
            <h2 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Ações Fiscais & Administrativas
            </h2>

            <div className="space-y-4">
                {/* NFe Section */}
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Nota Fiscal Eletrônica</h3>

                    {hasInvoice ? (
                        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">NFe #{invoice.id.slice(0, 8)}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${invoice.status === 'authorized' ? 'bg-green-100 text-green-700' :
                                    invoice.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {invoice.status.toUpperCase()}
                                </span>
                            </div>
                            {invoice.pdfUrl && (
                                <a
                                    href={invoice.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                >
                                    <Download className="w-4 h-4" />
                                    Baixar PDF (DANFE)
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-2">
                            <div className="flex gap-2 items-start">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <p className="font-semibold">Nenhuma nota emitida.</p>
                                    <p className="opacity-80">Verifique se o pedido está pago antes de emitir.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!hasInvoice && (
                        <Button
                            onClick={handleEmitNfe}
                            disabled={isLoading}
                            variant="primary"
                            className="w-full mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Emitindo...
                                </>
                            ) : (
                                'Emitir Nota Fiscal (Manual)'
                            )}
                        </Button>
                    )}
                </div>

                {/* Other Actions */}
                <div className="pt-4 border-t border-border space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Atualizar Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={orderStatus !== 'pending' || isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                const { updateOrderStatus } = await import('@/backend/actions/order-actions');
                                await updateOrderStatus(orderId, 'paid');
                                toast.success('Pedido marcado como PAGO');
                                setIsLoading(false);
                            }}
                        >
                            Confirmar Pagamento
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={orderStatus !== 'paid' || isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                const { updateOrderStatus } = await import('@/backend/actions/order-actions');
                                await updateOrderStatus(orderId, 'processing');
                                toast.success('Pedido marcado como EM PROCESSAMENTO');
                                setIsLoading(false);
                            }}
                        >
                            Processar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!['paid', 'processing'].includes(orderStatus) || isLoading}
                            onClick={async () => {
                                const code = prompt("Digite o código de rastreamento:", "");
                                if (code === null) return;
                                
                                setIsLoading(true);
                                const { updateOrderStatus } = await import('@/backend/actions/order-actions');
                                await updateOrderStatus(orderId, 'shipped', code);
                                toast.success('Pedido marcado como ENVIADO');
                                setIsLoading(false);
                            }}
                        >
                            Enviar / Rastreio
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={orderStatus !== 'shipped' || isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                const { updateOrderStatus } = await import('@/backend/actions/order-actions');
                                await updateOrderStatus(orderId, 'delivered');
                                toast.success('Pedido marcado como ENTREGUE');
                                setIsLoading(false);
                            }}
                        >
                            Entregue
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!['paid', 'shipped', 'delivered'].includes(orderStatus) || isLoading}
                            onClick={async () => {
                                if (!confirm("Deseja realmente reembolsar este pedido?")) return;
                                
                                setIsLoading(true);
                                const { updateOrderStatus } = await import('@/backend/actions/order-actions');
                                await updateOrderStatus(orderId, 'refunded');
                                toast.success('Pedido marcado como REEMBOLSADO');
                                setIsLoading(false);
                            }}
                        >
                            Reembolsar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400"
                            disabled={['cancelled', 'delivered', 'refunded'].includes(orderStatus) || isLoading}
                            onClick={async () => {
                                if (!confirm("Confirmar cancelamento do pedido? Isso fará rollback de estoque e pontos.")) return;
                                
                                setIsLoading(true);
                                const { updateOrderStatus } = await import('@/backend/actions/order-actions');
                                await updateOrderStatus(orderId, 'cancelled');
                                toast.success('Pedido CANCELADO e estoque restaurado');
                                setIsLoading(false);
                            }}
                        >
                            Cancelar Pedido
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
