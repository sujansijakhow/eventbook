"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { useRegister } from "@/hooks/useAuthActions";
import { fieldError } from "@/lib/api";
import { validateRegister, type Errors } from "@/lib/validation";

export function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const mutation = useRegister();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        mutation.reset();

        const found = validateRegister({ name, email, password });
        setErrors(found);

        if (Object.keys(found).length > 0) {
            return;
        }

        mutation.mutate({ name: name.trim(), email: email.trim(), password });
    }

    return (
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="mt-1.5 mb-5 text-sm text-slate-500">
                Register to book seats at upcoming events.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {mutation.isError && <Alert>{mutation.error.message}</Alert>}

                <FormField
                    id="name"
                    label="Name"
                    placeholder="Your name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    error={errors.name ?? fieldError(mutation.error, "name")}
                />
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
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    hint="At least 8 characters"
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
                    {mutation.isPending ? "Creating account…" : "Register"}
                </Button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-brand-700 hover:underline"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}