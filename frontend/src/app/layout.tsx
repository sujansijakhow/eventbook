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
                    <Navbar />
                    <main className="mx-auto max-w-6xl px-4 py-8">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}