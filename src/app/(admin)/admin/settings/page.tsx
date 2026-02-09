import { FadeIn } from "@/frontend/components/ui/Motion";
import { Button } from "@/frontend/components/ui/Button";

export default async function SettingsPage() {
    // Mock Config Data (Future: Fetch from DB)
    const config = {
        storeName: "Loja Tech Premium",
        primaryColor: "#000000",
        currency: "BRL"
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Configurações da Loja</h1>
                    <Button>Salvar Alterações</Button>
                </div>
                <p className="text-muted-foreground mt-2">Gerencie as informações principais e a aparência da sua loja.</p>
            </FadeIn>

            <FadeIn delay={0.1} className="grid gap-6 glass p-6 rounded-xl border border-border shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Geral</h2>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Nome da Loja</label>
                            <input
                                type="text"
                                defaultValue={config.storeName}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Moeda</label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="BRL">Real Brasileiro (BRL)</option>
                                <option value="USD">Dólar Americano (USD)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.2} className="grid gap-6 glass p-6 rounded-xl border border-border shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Aparência</h2>
                    <div className="grid gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-border" style={{ backgroundColor: config.primaryColor }}></div>
                            <div className="grid gap-2 flex-1">
                                <label className="text-sm font-medium">Cor Primária (Hex)</label>
                                <input
                                    type="text"
                                    defaultValue={config.primaryColor}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
