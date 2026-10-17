import { z } from "zod";

export type Errors = Record<string, string>;

const email = z
    .string()
    .trim()
    .pipe(z.email("Enter a valid email address"));

const loginSchema = z.object({
    email,
    password: z.string().min(1, "Enter your password"),
});

const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
    email,
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters"),
});

function check(schema: z.ZodType, values: unknown): Errors {
    const result = schema.safeParse(values);

    if (result.success) {
        return {};
    }

    const errors: Errors = {};

    for (const issue of result.error.issues) {
        errors[String(issue.path[0])] ??= issue.message;
    }

    return errors;
}

export function validateLogin(values: {
    email: string;
    password: string;
}) {
    return check(loginSchema, values);
}

export function validateRegister(values: {
    name: string;
    email: string;
    password: string;
}) {
    return check(registerSchema, values);
}