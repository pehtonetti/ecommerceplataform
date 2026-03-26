"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Copy, CheckCircle2, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { toast } from "sonner";
import { generatePixPayment, checkPixPaymentStatus } from "@/backend/actions/payment-actions";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

interface PixPaymentProps {
    orderId: string;
    amount: number;
}

export function PixPayment({ orderId, amount }: PixPaymentProps) {
    const router = useRouter();
    const [pixData, setPixData] = useState<{
        qrCode: string;
        transactionId: string;
        expiresAt: Date;
        description?: string;
    } | null>(null);
    const [qrCodeImage, setQrCodeImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "expired">("pending");
    const pollingInterval = useRef<NodeJS.Timeout | undefined>(undefined);

    // Gera o QR Code PIX ao montar o componente
    useEffect(() => {
        const generatePix = async () => {
            setLoading(true);
            const result = await generatePixPayment(orderId);

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            if (result.success && result.qrCode) {
                setPixData({
                    qrCode: result.qrCode,
                    transactionId: result.transactionId,
                    expiresAt: new Date(result.expiresAt),
                    description: result.description
                });

                // Gera imagem do QR Code
                try {
                    const qrImage = await QRCode.toDataURL(result.qrCode, {
                        width: 300,
                        margin: 2,
                        color: {
                            dark: "#000000",
                            light: "#FFFFFF"
                        }
                    });
                    setQrCodeImage(qrImage);
                } catch (err) {
                    console.error("Erro ao gerar imagem QR Code:", err);
                }
            }

            setLoading(false);
        };

        generatePix();
    }, [orderId]);

    // Timer de expiração
    useEffect(() => {
        if (!pixData?.expiresAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const expiry = new Date(pixData.expiresAt).getTime();
            const remaining = Math.max(0, Math.floor((expiry - now) / 1000));

            setTimeRemaining(remaining);

            if (remaining === 0) {
                setPaymentStatus("expired");
                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                }
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [pixData]);

    // Polling para verificar pagamento
    useEffect(() => {
        if (!pixData || paymentStatus !== "pending") return;

        const checkPayment = async () => {
            const result = await checkPixPaymentStatus(orderId);

            if (result.success) {
                if (result.status === "paid") {
                    setPaymentStatus("paid");
                    toast.success("Pagamento confirmado!");

                    // Redireciona para página de sucesso após 2 segundos
                    setTimeout(() => {
                        router.push(`/checkout/success/${orderId}`);
                    }, 2000);
                } else if (result.status === "expired") {
                    setPaymentStatus("expired");
                }
            }
        };

        // Verifica a cada 3 segundos
        pollingInterval.current = setInterval(checkPayment, 3000);

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [pixData, orderId, paymentStatus, router]);

    const handleCopyCode = async () => {
        if (!pixData?.qrCode) return;

        try {
            await navigator.clipboard.writeText(pixData.qrCode);
            toast.success("Código PIX copiado!");
        } catch (err) {
            toast.error("Erro ao copiar código");
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatAmount = (amountInCents: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amountInCents / 100);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Gerando QR Code PIX...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-destructive font-medium">{error}</p>
                <Button onClick={() => router.push("/checkout")} variant="outline">
                    Voltar ao Checkout
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {paymentStatus === "paid" ? (
                    <motion.div
                        key="paid"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-12 space-y-4 bg-green-50 rounded-[2rem] border border-green-100"
                    >
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                        <h2 className="text-2xl font-bold text-green-900">
                            Pagamento Confirmado!
                        </h2>
                        <p className="text-green-600 font-medium text-sm">
                            Redirecionando para seu pedido...
                        </p>
                    </motion.div>
                ) : paymentStatus === "expired" ? (
                    <motion.div
                        key="expired"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-12 space-y-4 bg-red-50 rounded-[2rem] border border-red-100"
                    >
                        <AlertCircle className="w-20 h-20 text-red-500" />
                        <h2 className="text-2xl font-bold text-red-900">
                            QR Code Expirado
                        </h2>
                        <p className="text-red-500 text-center font-medium text-sm">
                            O tempo para pagamento expirou. Gere um novo para continuar.
                        </p>
                        <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white rounded-xl">
                            Gerar Novo QR Code
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="pending"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                                <QrCode className="w-4 h-4 text-indigo-600" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-600">Pagamento via PIX</span>
                            </div>
                            <h1 className="text-3xl font-black text-zinc-900">Escaneie o QR Code</h1>
                            <p className="text-2xl font-black text-zinc-900">{formatAmount(amount)}</p>
                            {pixData?.description && (
                                <p className="text-xs text-zinc-400 max-w-xs mx-auto font-medium">
                                    {pixData.description}
                                </p>
                            )}
                        </div>

                        {/* QR Code Container */}
                        <div className="bg-white rounded-[2rem] p-4 md:p-10 border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                            <div className="flex flex-col items-center space-y-10">
                                {qrCodeImage ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, type: "spring", damping: 15 }}
                                        className="bg-white p-6 rounded-[1.8rem] shadow-sm border border-zinc-50"
                                    >
                                        <img
                                            src={qrCodeImage}
                                            alt="QR Code PIX"
                                            className="w-[260px] h-[260px]"
                                        />
                                    </motion.div>
                                ) : (
                                    <div className="w-[260px] h-[260px] bg-zinc-50 rounded-[1.8rem] animate-pulse flex items-center justify-center">
                                        <RefreshCw className="w-8 h-8 text-zinc-200 animate-spin" />
                                    </div>
                                )}

                                <div className="w-full space-y-4">
                                    <p className="text-[10px] uppercase tracking-widest text-center text-zinc-400 font-black">
                                        Copia e Cola
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl p-4 overflow-hidden group">
                                            <p className="text-[10px] font-mono text-zinc-400 truncate">
                                                {pixData?.qrCode}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleCopyCode}
                                            className="px-6 h-14 bg-zinc-900 text-white rounded-2xl font-bold text-xs hover:bg-zinc-800 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-zinc-100"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions & Timer Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                                <h3 className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-4">
                                    Passo a Passo
                                </h3>
                                <ul className="space-y-3 text-xs text-zinc-600 font-bold">
                                    <li className="flex gap-3">
                                        <span className="text-zinc-300">01</span>
                                        <span>Abra o app do seu banco</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-zinc-300">02</span>
                                        <span>Escolha 'Pagar via PIX'</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-zinc-300">03</span>
                                        <span>Confirme o valor e finalize</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] uppercase tracking-widest font-black text-amber-600/60">
                                        Expira em
                                    </h3>
                                    <Clock className="w-4 h-4 text-amber-500" />
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="font-mono text-3xl font-black text-amber-600">
                                        {formatTime(timeRemaining)}
                                    </span>
                                    <span className="text-[10px] font-bold text-amber-600/60 uppercase">minutos</span>
                                </div>
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping absolute inset-0"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full relative"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                    Conexão Segura Ativa
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-300 font-medium">Aguardando confirmação automática do Banco Inter...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
