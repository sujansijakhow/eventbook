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

const eventSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(150, "Title must be at most 150 characters"),
    description: z
        .string()
        .trim()
        .max(2000, "Description must be at most 2000 characters"),
    venue: z
        .string()
        .trim()
        .min(2, "Venue must be at least 2 characters")
        .max(150, "Venue must be at most 150 characters"),
    startsAt: z.string().min(1, "Choose a date and time"),
    totalSeats: z.coerce
        .number("Enter the number of seats")
        .int("Seats must be a whole number")
        .min(1, "There must be at least 1 seat")
        .max(10000, "At most 10000 seats"),
});

export function validateEvent(values: {
    title: string;
    description: string;
    venue: string;
    startsAt: string;
    totalSeats: string;
}) {
    return check(eventSchema, values);
}