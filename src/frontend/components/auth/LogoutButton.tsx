'use client';

import { useState } from 'react';
import { logout } from '@/backend/actions/auth-actions';
import { Button } from '@/frontend/components/ui/Button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
    className?: string;
    variant?: 'ghost' | 'primary' | 'outline' | 'danger' | 'secondary';
    collapsed?: boolean;
}

export function LogoutButton({ className, variant = 'ghost', collapsed = false }: LogoutButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleLogout = async () => {
        setIsLeaving(true);
        await logout();
    };

    if (showConfirm) {
        return (
            <div className={cn("flex flex-col gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/50 animate-in fade-in slide-in-from-top-2", className)}>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-center mb-1">
                    Tem certeza?
                </p>
                <div className="flex gap-2 justify-stretch">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 h-7 text-xs"
                        disabled={isLeaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={handleLogout}
                        className="flex-1 h-7 text-xs"
                        disabled={isLeaving}
                    >
                        {isLeaving ? '...' : 'Sair'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Button
            variant={variant}
            className={cn("w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10", className)}
            onClick={() => setShowConfirm(true)}
        >
            <LogOut className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && "Sair"}
        </Button>
    );
}
