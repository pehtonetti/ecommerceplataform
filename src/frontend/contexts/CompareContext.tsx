"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface CompareContextType {
    compareList: any[];
    addToCompare: (product: any) => void;
    removeFromCompare: (productId: string) => void;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [compareList, setCompareList] = useState<any[]>([]);

    const addToCompare = (product: any) => {
        if (compareList.length >= 4) {
            toast.error("Você só pode comparar até 4 produtos por vez.");
            return;
        }
        if (compareList.some(p => p.id === product.id)) {
            toast.error("Este produto já está na comparação.");
            return;
        }
        setCompareList([...compareList, product]);
        toast.info(`${product.name} adicionado para comparação.`);
    };

    const removeFromCompare = (productId: string) => {
        setCompareList(compareList.filter(p => p.id !== productId));
    };

    const clearCompare = () => setCompareList([]);

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) throw new Error("useCompare must be used within a CompareProvider");
    return context;
}
