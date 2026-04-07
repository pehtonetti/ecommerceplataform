"use client";

import { Download } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ExportInventoryButton({ products }: { products: any[] }) {

    const handleExport = async () => {
        // 1. Create Workbook & Worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Estoque");

        // 2. Define Columns
        worksheet.columns = [
            { header: "ID", key: "id", width: 20 },
            { header: "Nome", key: "name", width: 30 },
            { header: "Categoria", key: "category", width: 20 },
            { header: "Preço (R$)", key: "price", width: 15 },
            { header: "Estoque", key: "stock", width: 10 },
            { header: "Valor Total (R$)", key: "total", width: 15 },
            { header: "Ativo", key: "active", width: 10 },
        ];

        // 3. Add Rows
        products.forEach(p => {
            worksheet.addRow({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price / 100,
                stock: p.stock,
                total: (p.price * p.stock) / 100,
                active: p.active ? "Sim" : "Não"
            });
        });

        // 4. Style Header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // 5. Generate Buffer & Download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Relatorio_Estoque.xlsx");
    };

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Excel
        </Button>
    );
}
