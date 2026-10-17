"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { api, tokenStore } from "@/lib/api";
import type { User } from "@/types";

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string,
    ) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const request = tokenStore.get()
            ? api.get<{ user: User }>("/api/auth/me")
            : Promise.resolve(null);

        request
            .then((data) => setUser(data?.user ?? null))
            .catch(() => tokenStore.clear())
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const data = await api.post<{ token: string; user: User }>(
            "/api/auth/login",
            { email, password },
        );

        tokenStore.set(data.token);
        setUser(data.user);
    }

    async function register(
        name: string,
        email: string,
        password: string,
    ) {
        await api.post("/api/auth/register", { name, email, password });
        await login(email, password);
    }

    function logout() {
        tokenStore.clear();
        setUser(null);
        queryClient.clear();
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}