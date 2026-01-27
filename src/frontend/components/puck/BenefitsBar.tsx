'use client';

export default function BenefitsBar() {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white container mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                    <h3 className="text-xl font-bold mb-2">Frete Grátis</h3>
                    <p className="text-sm opacity-90">Em compras acima de R$ 99</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
                    <p className="text-sm opacity-90">Seus dados protegidos</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Troca Grátis</h3>
                    <p className="text-sm opacity-90">Até 30 dias após a compra</p>
                </div>
            </div>
        </section>
    );
}
