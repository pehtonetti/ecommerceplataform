import { updateProduct } from "@/backend/actions/product-actions";
import ProductForm from "../ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        notFound();
    }

    const updateAction = updateProduct.bind(null, product.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
                <p className="text-muted-foreground">Alterar informações de {product.name}.</p>
            </div>

            <ProductForm
                action={updateAction}
                initialData={{
                    ...product,
                    price: product.price, // Form handles conversion
                    imageUrl: product.imageUrl
                }}
            />
        </div>
    );
}
