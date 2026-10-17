import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/shared/Navbar";
import { Providers } from "@/components/shared/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EventBook",
    description: "Browse upcoming events and book a seat.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}
            >
                <Providers>
                    <Suspense
                        fallback={
                            <header className="border-b border-slate-200 bg-white">
                                <nav className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-5 px-4 py-2">
                                    <span className="mr-auto text-lg font-bold text-brand-700">
                                        EventBook
                                    </span>
                                </nav>
                            </header>
                        }
                    >
                        <Navbar />
                    </Suspense>
                    <main className="mx-auto max-w-6xl px-4 py-8">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}