"use client";

import { useEffect } from "react";
import { logBehavior } from "@/backend/actions/ai-actions";

export function BehaviorTracker({
    productId,
    action = 'product_view',
    metadata = {}
}: {
    productId?: string,
    action?: string,
    metadata?: any
}) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            logBehavior(action, {
                productId,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                ...metadata
            });
        }, 2000); // Wait 2s to log as "meaningful view"

        return () => clearTimeout(timeout);
    }, [productId, action, metadata]);

    return null; // Invisible component
}

/**
 * Persuader AI Popup
 * Component that shows "inconvenient" or urgent offers based on behavior.
 */
export function AiAggregator() {
    useEffect(() => {
        // Logic to show emergency offers or "Don't leave yet!" messages
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                // User is leaving the page
                // This is where we'd trigger a "WAIT! You left something in your bag!" modal
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    return null;
}
