import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";
import { isUniqueViolation } from "../lib/dbErrors.js";
import type {
    LoginInput,
    RegisterInput,
} from "../schemas/auth.schema.js";

export async function register({
    name,
    email,
    password,
}: RegisterInput) {
    const passwordHash = await bcrypt.hash(password, 12);

    try {
        const [user] = await db
            .insert(users)
            .values({
                name,
                email,
                passwordHash,
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            });

        return user;
    } catch (error) {
        if (isUniqueViolation(error)) {
            throw new HttpError(
                409,
                "Email is already registered",
            );
        }

        throw error;
    }
}

export async function login({
    email,
    password,
}: LoginInput) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (
        !user ||
        !(await bcrypt.compare(password, user.passwordHash))
    ) {
        throw new HttpError(
            401,
            "Invalid email or password",
        );
    }

    const token = jwt.sign(
        { role: user.role },
        env.JWT_SECRET,
        {
            subject: user.id,
            expiresIn:
                env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
        },
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}