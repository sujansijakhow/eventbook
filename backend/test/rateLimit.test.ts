import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import request from "supertest";

import { app } from "../src/app.js";

describe("login rate limit", () => {
    it("blocks an IP after 10 failed attempts with 429", async () => {
        const email = `nobody-${randomUUID().slice(0, 8)}@example.com`;
        const attempt = () =>
            request(app)
                .post("/api/auth/login")
                .send({ email, password: "WrongPass1" });

               for (let i = 0; i < 5; i++) {
            const res = await attempt();

            expect(res.status).toBe(401);
        }

        const blocked = await attempt();

        expect(blocked.status).toBe(429);
        expect(blocked.body.error.message).toMatch(/too many/i);
    });
});