"use client";

import { Button } from "@/frontend/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/frontend/components/ui/Dialog";
import { Star, Truck, Check, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/frontend/components/ui/Textarea";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OrderActions({ order }: { order: any }) {
    const isDelivered = order.status === 'delivered';
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRating = async () => {
        setIsSubmitting(true);
        // Mock API call
        await new Promise(r => setTimeout(r, 1000));
        toast.success("Avaliação enviada com sucesso!");
        setIsSubmitting(false);
    };

    return (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            {/* Tracking (Always visible for active orders) */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                        <Truck className="w-4 h-4 mr-2" />
                        Rastrear
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rastreamento do Pedido</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-zinc-800"></div>

                        {/* Steps */}
                        <div className="relative flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center z-10 shrink-0 border-4 border-white dark:border-zinc-950">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Pedido Recebido</h4>
                                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                                <p className="text-sm mt-1">{order.status === 'pending' ? 'Aguardando pagamento...' : 'Aguardando processamento.'}</p>
                            </div>
                        </div>

                        <div className="relative flex gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-white dark:border-zinc-950 ${!['pending', 'paid'].includes(order.status) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Em Processamento</h4>
                                <p className="text-xs text-muted-foreground">{['processing', 'shipped', 'delivered'].includes(order.status) ? 'Concluído' : 'Pendente'}</p>
                            </div>
                        </div>

                        <div className="relative flex gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-white dark:border-zinc-950 ${['shipped', 'delivered'].includes(order.status) ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Em Trânsito</h4>
                                {order.trackingCode && <p className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 p-1 rounded mt-1">Ref: {order.trackingCode}</p>}
                                <p className="text-sm mt-1">{order.status === 'shipped' ? 'A caminho do destinatário' : ''}</p>
                            </div>
                        </div>

                        <div className="relative flex gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-white dark:border-zinc-950 ${order.status === 'delivered' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                                <Check className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Entregue</h4>
                                <p className="text-xs text-muted-foreground">{order.status === 'delivered' ? 'Pedido entregue com sucesso!' : '-'}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Review Button (Only if delivered) */}
            {isDelivered && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="primary" size="sm" className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                            <Star className="w-4 h-4 mr-2" />
                            Avaliar
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Avaliar Compra</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setRating(s)}
                                        className={`transition-transform hover:scale-110 ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                            <p className="text-center font-medium">
                                {rating === 5 ? "Adorei!" : rating >= 4 ? "Gostei" : rating >= 3 ? "Razoável" : "Não gostei"}
                            </p>
                            <Textarea
                                placeholder="Conte o que achou do produto..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                            <Button onClick={handleRating} disabled={rating === 0 || isSubmitting} className="w-full">
                                {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
