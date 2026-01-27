"use client";

import { Download } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import * as XLSX from "xlsx";

export function ExportInventoryButton({ products }: { products: any[] }) {

    const handleExport = () => {
        // 1. Format Data
        const data = products.map(p => ({
            ID: p.id,
            Nome: p.name,
            Categoria: p.category,
            "Preço (R$)": p.price / 100,
            Estoque: p.stock,
            "Valor Total (R$)": (p.price * p.stock) / 100,
            Ativo: p.active ? "Sim" : "Não"
        }));

        // 2. Create Sheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");

        // 3. Download File
        XLSX.writeFile(workbook, "Relatorio_Estoque.xlsx");
    };

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Excel
        </Button>
    );
}
