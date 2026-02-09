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
    const pollingInterval = useRef<NodeJS.Timeout>();

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
                        className="flex flex-col items-center justify-center p-12 space-y-4 bg-green-50 dark:bg-green-950/20 rounded-2xl border-2 border-green-500"
                    >
                        <CheckCircle2 className="w-20 h-20 text-green-600 dark:text-green-400" />
                        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
                            Pagamento Confirmado!
                        </h2>
                        <p className="text-green-600 dark:text-green-400">
                            Redirecionando...
                        </p>
                    </motion.div>
                ) : paymentStatus === "expired" ? (
                    <motion.div
                        key="expired"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-12 space-y-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border-2 border-red-500"
                    >
                        <AlertCircle className="w-20 h-20 text-red-600 dark:text-red-400" />
                        <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
                            QR Code Expirado
                        </h2>
                        <p className="text-red-600 dark:text-red-400 text-center">
                            O tempo para pagamento expirou. Por favor, gere um novo QR Code.
                        </p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Gerar Novo QR Code
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="pending"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                                <QrCode className="w-5 h-5 text-primary" />
                                <span className="text-sm font-bold text-primary">Pagamento via PIX</span>
                            </div>
                            <h1 className="text-3xl font-black">Escaneie o QR Code</h1>
                            <p className="text-lg font-bold text-primary">{formatAmount(amount)}</p>
                            {pixData?.description && (
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    {pixData.description}
                                </p>
                            )}
                        </div>

                        {/* Timer */}
                        <div className="flex items-center justify-center gap-2 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <span className="font-mono text-lg font-bold text-orange-700 dark:text-orange-300">
                                {formatTime(timeRemaining)}
                            </span>
                            <span className="text-sm text-orange-600 dark:text-orange-400">
                                para pagar
                            </span>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border-2 border-border shadow-xl">
                            <div className="flex flex-col items-center space-y-6">
                                {qrCodeImage && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white p-4 rounded-xl shadow-lg"
                                    >
                                        <img
                                            src={qrCodeImage}
                                            alt="QR Code PIX"
                                            className="w-[300px] h-[300px]"
                                        />
                                    </motion.div>
                                )}

                                <div className="w-full space-y-3">
                                    <p className="text-sm text-center text-muted-foreground font-medium">
                                        Ou copie o código PIX:
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-gray-50 dark:bg-zinc-950 border border-border rounded-lg p-3 overflow-hidden">
                                            <p className="text-xs font-mono text-muted-foreground truncate">
                                                {pixData?.qrCode}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleCopyCode}
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copiar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instruções */}
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
                                Como pagar com PIX:
                            </h3>
                            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                <li className="flex gap-2">
                                    <span className="font-bold">1.</span>
                                    <span>Abra o app do seu banco</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">2.</span>
                                    <span>Escolha pagar com PIX</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">3.</span>
                                    <span>Escaneie o QR Code ou cole o código</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">4.</span>
                                    <span>Confirme o pagamento</span>
                                </li>
                            </ol>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Aguardando confirmação do pagamento...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
