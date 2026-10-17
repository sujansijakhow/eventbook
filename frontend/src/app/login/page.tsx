"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { useLogin } from "@/hooks/useAuthActions";
import { fieldError } from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const mutation = useLogin();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        mutation.mutate({ email, password });
    }

    return (
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
            <h1 className="text-2xl font-bold">Log in</h1>
            <p className="mt-1.5 mb-5 text-sm text-slate-500">
                Welcome back to EventBook.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mutation.isError && <Alert>{mutation.error.message}</Alert>}

                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={fieldError(mutation.error, "email")}
                />
                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={fieldError(mutation.error, "password")}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Logging in…" : "Log in"}
                </Button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
                No account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-brand-700 hover:underline"
                >
                    Register
                </Link>
            </p>
        </div>
    );
}