'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { updateUserTheme } from '@/backend/actions/user-actions';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse" />
        );
    }

    return (
        <button
            onClick={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
                // Fire and forget - don't await to keep UI snappy
                updateUserTheme(newTheme);
            }}
            className="relative w-10 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center group"
            aria-label="Alternar tema"
        >
            {/* Sun Icon (Light Mode) */}
            <Sun className="w-5 h-5 text-yellow-500 absolute transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />

            {/* Moon Icon (Dark Mode) */}
            <Moon className="w-5 h-5 text-blue-400 absolute transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />

            {/* Tooltip */}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </span>
        </button>
    );
}
