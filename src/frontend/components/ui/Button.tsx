'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

import { motion } from 'framer-motion';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        };

        const sizes = {
            sm: 'h-9 px-3 rounded-md text-sm',
            md: 'h-11 px-8 rounded-lg',
            lg: 'h-14 px-10 rounded-xl text-lg',
        };

        return (
            <motion.button
                ref={ref as any} // motion refs are slightly different
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...(props as any)}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
