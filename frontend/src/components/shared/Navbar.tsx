"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button, buttonClass } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const linkClass = (active: boolean) =>
    `text-sm font-medium ${
        active
            ? "text-brand-700"
            : "text-slate-600 hover:text-slate-900"
    }`;

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    function handleLogout() {
        logout();
        router.push("/");
    }

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

                {!loading && !user && (
                    <>
                        <Link
                            href="/login"
                            className={linkClass(pathname === "/login")}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className={buttonClass("primary")}
                        >
                            Register
                        </Link>
                    </>
                )}

                {user && (
                    <>
                        <Link
                            href="/my-bookings"
                            className={linkClass(
                                pathname === "/my-bookings",
                            )}
                        >
                            My bookings
                        </Link>
                        {user.role === "admin" && (
                            <Link
                                href="/admin/events"
                                className={linkClass(
                                    pathname.startsWith("/admin"),
                                )}
                            >
                                Admin
                            </Link>
                        )}
                        <span className="text-sm text-slate-500">
                            {user.name}
                        </span>
                        <Button variant="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                )}
            </nav>
        </header>
    );
}