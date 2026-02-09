"use client";

import { useEffect, useState } from "react";
import { getLoyaltyHistory, redeemPointsForCoupon } from "@/backend/actions/loyalty-actions";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Coins, Ticket, History, Gift } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LoyaltyHub({ user }: { user: any }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [history, setHistory] = useState<any[]>([]);
    const [points, setPoints] = useState(user.loyaltyPoints || 0);

    useEffect(() => {
        getLoyaltyHistory().then(data => {
            setHistory(data);
        });
    }, []);

    const handleRedeem = async (pointsToSpend: number) => {
        const res = await redeemPointsForCoupon(pointsToSpend);
        if (res.error) {
            toast.error(res.error);
        } else {
            setPoints(points - pointsToSpend);
            toast.success(`Parabéns! Você resgatou um cupom de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((res.discountValue || 0) / 100)}`);
            // Refresh history
            getLoyaltyHistory().then(setHistory);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
            <FadeIn>
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-2xl text-yellow-600 dark:text-yellow-400">
                        <Coins className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Loyalty Hub</h1>
                        <p className="text-muted-foreground">Transforme suas compras em experiências e benefícios exclusivos.</p>
                    </div>
                </div>

                {/* Score Card */}
                <div className="glass p-8 rounded-3xl border border-yellow-200 dark:border-yellow-900/30 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-zinc-900 mb-8 overflow-hidden relative">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <p className="text-sm font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-widest mb-1">Seu Saldo Atual</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-zinc-900 dark:text-white">{points.toLocaleString()}</span>
                                <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">pts</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-yellow-200/50">
                                <p className="text-xs text-muted-foreground">Status do Perfil</p>
                                <p className="font-bold text-zinc-900 dark:text-white">Explorador Silver</p>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-yellow-200/50">
                                <p className="text-xs text-muted-foreground">Próximo Nível</p>
                                <p className="font-bold text-zinc-900 dark:text-white">1.500 pts restantes</p>
                            </div>
                        </div>
                    </div>
                    <Gift className="absolute -bottom-4 -right-4 w-32 h-32 text-yellow-400/10 -rotate-12" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Redeem Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-primary" /> Resgatar Benefícios
                        </h2>
                        <div className="space-y-3">
                            {[
                                { pts: 500, value: 500, label: "Cupom de R$ 5,00" },
                                { pts: 1000, value: 1000, label: "Cupom de R$ 10,00" },
                                { pts: 2500, value: 2500, label: "Cupom de R$ 25,00" },
                                { pts: 5000, value: 5000, label: "Cupom de R$ 50,00" },
                            ].map((item) => (
                                <div key={item.pts} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${points >= item.pts ? 'bg-white dark:bg-zinc-900 border-border hover:shadow-lg' : 'bg-gray-50 dark:bg-zinc-950/50 border-transparent opacity-60'}`}>
                                    <div>
                                        <p className="font-bold">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.pts} pontos</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        disabled={points < item.pts}
                                        onClick={() => handleRedeem(item.pts)}
                                    >
                                        Resgatar
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" /> Histórico
                        </h2>
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border divide-y divide-border overflow-hidden">
                            {history.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm italic">
                                    Nenhuma movimentação ainda.
                                </div>
                            ) : (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                history.map((log: any) => (
                                    <div key={log.id} className="p-4 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-medium">{log.description}</p>
                                            <p className="text-[10px] text-muted-foreground capitalize">{log.type} • {new Date(log.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`font-bold ${log.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {log.points > 0 ? `+${log.points}` : log.points}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
