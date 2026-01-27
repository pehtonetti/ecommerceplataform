"use client";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import config from "@/lib/puck.config";
import { Button } from "@/frontend/components/ui/Button";
import { saveLayoutConfig } from "@/backend/actions/layout-actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function EditorPage({ initialData }: { initialData: any }) {
    // We need to fetch the initial data from the Server Comp wrapper
    // But for now, let's just make this page fetch it or receive it.
    // Actually, Puck handles its own state. 

    const handlePublish = async (data: any) => {
        await saveLayoutConfig(data); // We reuse the action, but need to update it to accept 'any' (Puck Data)
        toast.success("Layout salvo com sucesso!");
    };

    return (
        <div className="h-screen w-full bg-background">
            <Puck
                config={config}
                data={initialData || { content: [], root: {} }}
                onPublish={handlePublish}
                headerTitle="Editor Visual da Loja"
            />
        </div>
    );
}
