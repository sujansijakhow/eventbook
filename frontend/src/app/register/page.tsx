"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { useRegister } from "@/hooks/useAuthActions";
import { fieldError } from "@/lib/api";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const mutation = useRegister();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        mutation.mutate({ name, email, password });
    }

    return (
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="mt-1.5 mb-5 text-sm text-slate-500">
                Register to book seats at upcoming events.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mutation.isError && <Alert>{mutation.error.message}</Alert>}

                <FormField
                    id="name"
                    label="Name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    error={fieldError(mutation.error, "name")}
                />
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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    hint="At least 8 characters"
                    error={fieldError(mutation.error, "password")}
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