import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { eq } from "drizzle-orm";

import { app } from "../src/app.js";
import { db } from "../src/db/db.js";
import { users } from "../src/db/schema.js";

const email = `auth-test-${Date.now()}@example.com`;
const password = "TestPass123!";

afterAll(async () => {
    await db.delete(users).where(eq(users.email, email));
});

describe("auth", () => {
    it("registers a normal user and ignores a role in the body", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email,
                password,
                role: "admin",
            });

        expect(res.status).toBe(201);
        expect(res.body.user.role).toBe("user");
        expect(res.body.user.passwordHash).toBeUndefined();
    });

    it("rejects a duplicate email with 409", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ name: "Test User", email, password });

        expect(res.status).toBe(409);
    });

    it("rejects a wrong password with 401", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "WrongPass123!" });

        expect(res.status).toBe(401);
    });

    it("logs in and returns the profile from /me", async () => {
        const login = await request(app)
            .post("/api/auth/login")
            .send({ email, password });

        expect(login.status).toBe(200);

        const me = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${login.body.token}`);

        expect(me.status).toBe(200);
        expect(me.body.user.email).toBe(email);
    });

    it("rejects /me without a token with 401", async () => {
        const res = await request(app).get("/api/auth/me");

        expect(res.status).toBe(401);
    });
});