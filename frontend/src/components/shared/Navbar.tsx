"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonClass } from "@/components/ui/Button";

const linkClass = (active: boolean) =>
    `text-sm font-medium ${
        active
            ? "text-brand-600"
            : "text-slate-600 hover:text-slate-900"
    }`;

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-5 px-4 py-2">
                <Link
                    href="/"
                    className="mr-auto text-lg font-bold text-brand-700"
                >
                    EventBook
                </Link>
                <Link href="/" className={linkClass(pathname === "/")}>
                    Events
                </Link>
                <Link
                    href="/login"
                    className={linkClass(pathname === "/login")}
                >
                    Login
                </Link>
                <Link href="/register" className={buttonClass("primary")}>
                    Register
                </Link>
            </nav>
        </header>
    );
}