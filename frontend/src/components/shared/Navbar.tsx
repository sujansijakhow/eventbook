"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button, buttonClass } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const linkClass = (active: boolean) =>
    `text-sm font-medium ${
        active ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
    }`;

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const isAdmin = user?.role === "admin";

    function handleLogout() {
        logout();
        router.push("/login");
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
                        {!isAdmin && (
                            <Link
                                href="/my-bookings"
                                className={linkClass(
                                    pathname === "/my-bookings",
                                )}
                            >
                                My bookings
                            </Link>
                        )}

                                               {isAdmin && (
                            <>
                                <Link
                                    href="/admin"
                                    className={linkClass(
                                        pathname === "/admin",
                                    )}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/events"
                                    className={linkClass(
                                        pathname.startsWith("/admin/events"),
                                    )}
                                >
                                    Manage events
                                </Link>
                            </>
                        )}

                        <div
                            className="flex items-center gap-2"
                            title={user.email}
                        >
                            <span
                                aria-hidden
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white"
                            >
                                {user.name.trim().charAt(0).toUpperCase()}
                            </span>
                            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                                {user.name}
                            </span>
                            <span className="sr-only sm:hidden">
                                {user.name}
                            </span>
                        </div>

                        <Button variant="secondary" onClick={handleLogout}>
                            <LogOut size={16} aria-hidden />
                            Logout
                        </Button>
                    </>
                )}
            </nav>
        </header>
    );
}
