"use client";

import { useEffect, useState } from "react";

export function useLanguageDetection() {
    const [locale, setLocale] = useState("pt-BR");

    useEffect(() => {
        // Detect browser language
        const browserLang = navigator.language;
        if (browserLang.startsWith("en")) {
            setLocale("en-US");
        } else if (browserLang.startsWith("es")) {
            setLocale("es-ES");
        } else {
            setLocale("pt-BR");
        }
    }, []);

    return locale;
}

export function LocaleSwitcher() {
    const locale = useLanguageDetection();

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="uppercase">{locale.split('-')[1]}</span>
            <div className="w-4 h-4 rounded-full overflow-hidden border border-border">
                {locale === 'pt-BR' && <img src="https://flagcdn.com/w20/br.png" alt="BR" />}
                {locale === 'en-US' && <img src="https://flagcdn.com/w20/us.png" alt="US" />}
                {locale === 'es-ES' && <img src="https://flagcdn.com/w20/es.png" alt="ES" />}
            </div>
        </div>
    );
}
