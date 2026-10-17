"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { useLogin } from "@/hooks/useAuthActions";
import { fieldError } from "@/lib/api";
import { validateLogin, type Errors } from "@/lib/validation";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const mutation = useLogin();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        mutation.reset();

        const found = validateLogin({ email, password });
        setErrors(found);

        if (Object.keys(found).length > 0) {
            return;
        }

        mutation.mutate({ email: email.trim(), password });
    }

    return (
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
            <h1 className="text-2xl font-bold">Log in</h1>
            <p className="mt-1.5 mb-5 text-sm text-slate-500">
                Welcome back to EventBook.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {mutation.isError && <Alert>{mutation.error.message}</Alert>}

                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={errors.email ?? fieldError(mutation.error, "email")}
                />
                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    showPasswordToggle
                    placeholder="Your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={
                        errors.password ??
                        fieldError(mutation.error, "password")
                    }
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