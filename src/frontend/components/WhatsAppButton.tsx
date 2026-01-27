"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
    const phoneNumber = "5511999999999"; // Replace with actual number from config
    const message = "Olá! Gostaria de falar sobre um pedido.";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle className="w-8 h-8" fill="white" />
        </a>
    );
}
