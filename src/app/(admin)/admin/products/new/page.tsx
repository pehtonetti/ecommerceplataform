import { createProduct } from "@/backend/actions/product-actions";
import ProductForm from "../ProductForm";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
                <p className="text-muted-foreground">Adicione um novo item ao catálogo.</p>
            </div>

            <ProductForm action={createProduct} />
        </div>
    );
}
