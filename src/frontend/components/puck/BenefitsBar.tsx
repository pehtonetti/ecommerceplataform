'use client';

export default function BenefitsBar({ 
    items = [] 
}: { 
    items?: { title: string; subtitle: string }[] 
}) {
    // Fallback if empty
    const displayItems = items.length > 0 ? items : [
        { title: "Frete Grátis", subtitle: "Em compras acima de R$ 99" },
        { title: "Pagamento Seguro", subtitle: "Seus dados protegidos" },
        { title: "Troca Grátis", subtitle: "Até 30 dias após a compra" }
    ];

    return (
        <section className="bg-primary text-white rounded-lg p-8 container mx-auto mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {displayItems.map((item, idx) => (
                    <div key={idx}>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-sm opacity-90">{item.subtitle}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
