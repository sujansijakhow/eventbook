"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

type Props = { children: ReactNode; role?: Role };

export function RequireAuth({ children, role }: Props) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const allowed = Boolean(user) && (!role || user?.role === role);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user) {
            router.replace("/login");
        } else if (!allowed) {
            router.replace("/");
        }
    }, [loading, user, allowed, router]);

    if (loading || !allowed) {
        return <Spinner />;
    }

    return <>{children}</>;
}