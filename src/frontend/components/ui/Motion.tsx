"use client";

import { motion } from "framer-motion";

export const FadeIn = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

export const SlideIn = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

export const ScaleIn = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);
