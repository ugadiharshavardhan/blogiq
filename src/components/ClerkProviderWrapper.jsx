"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function ClerkProviderWrapper({ children }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <ClerkProvider
            appearance={{
                baseTheme: mounted && resolvedTheme === "dark" ? dark : undefined,
            }}
        >
            {children}
        </ClerkProvider>
    );
}
