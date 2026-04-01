import { getMarketingCustomers } from "@/backend/actions/marketing-actions";
import { Button } from "@/frontend/components/ui/Button";
import { User, Mail, Calendar, ArrowRight, UserPlus, Search } from "lucide-react";
import Link from "next/link";

export default async function MerchantCustomersPage() {
    const { customers = [] } = await getMarketingCustomers();

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Seus Clientes</h1>
                    <p className="text-muted-foreground text-sm mt-1">Veja quem são as pessoas que compram na sua loja e seu histórico.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Cliente
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total de Clientes</p>
                        <p className="text-2xl font-bold">{customers.length}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 py-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        placeholder="Pesquisar por nome ou e-mail..." 
                        className="w-full bg-card border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <div key={customer.id} className="group p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all border-border/60">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                {customer.name?.[0]?.toUpperCase()}
                            </div>
                            <Link href={`/dashboard/customers/${customer.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg truncate">{customer.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Cliente desde {new Date(customer.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Última Compra</span>
                                <span className="text-sm font-semibold">Hoje</span>
                            </div>
                            <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                                Ativo
                            </div>
                        </div>
                    </div>
                ))}

                {customers.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">Nenhum cliente ainda</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                            Seus clientes aparecerão aqui assim que realizarem o cadastro ou a primeira compra.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
