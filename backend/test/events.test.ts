import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
} from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { like } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { app } from "../src/app.js";
import { db } from "../src/db/db.js";
import { env } from "../src/config/env.js";
import { bookings, events, users } from "../src/db/schema.js";

const prefix = `test-events-${randomUUID().slice(0, 8)}`;
const DAY = 24 * 60 * 60 * 1000;

let adminToken: string;
let userToken: string;
let userIds: string[];

function tokenFor(id: string, role: "user" | "admin") {
    return jwt.sign({ role }, env.JWT_SECRET, { subject: id });
}

function validEvent(overrides: Record<string, unknown> = {}) {
    return {
        title: `${prefix} event`,
        description: "Test event",
        venue: "Test venue",
        startsAt: new Date(Date.now() + 7 * DAY).toISOString(),
        totalSeats: 5,
        ...overrides,
    };
}

async function createEvent(overrides: Record<string, unknown> = {}) {
    const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validEvent(overrides));

    return res.body.event as { id: string; seatsLeft: number };
}

async function addBookings(eventId: string, count: number) {
    await db.insert(bookings).values(
        userIds.slice(0, count).map((userId) => ({
            userId,
            eventId,
        })),
    );
}

beforeAll(async () => {
    const [admin, user, other] = await db
        .insert(users)
        .values([
            {
                name: "Test Admin",
                email: `${prefix}-admin@example.com`,
                passwordHash: "not-a-real-hash",
                role: "admin",
            },
            {
                name: "Test User",
                email: `${prefix}-user@example.com`,
                passwordHash: "not-a-real-hash",
            },
            {
                name: "Test Other",
                email: `${prefix}-other@example.com`,
                passwordHash: "not-a-real-hash",
            },
        ])
        .returning({ id: users.id });

    adminToken = tokenFor(admin.id, "admin");
    userToken = tokenFor(user.id, "user");
    userIds = [user.id, other.id];
});

afterAll(async () => {
    // deleting users also deletes their bookings (cascade)
    await db.delete(users).where(like(users.email, `${prefix}%`));
    await db.delete(events).where(like(events.title, `${prefix}%`));
});

describe("public events", () => {
    it("lists upcoming events with search and pagination", async () => {
        await createEvent({ title: `${prefix} list a` });
        await createEvent({ title: `${prefix} list b` });

        const res = await request(app).get("/api/events").query({
            search: `${prefix} list`,
            limit: 1,
            page: 1,
        });

        expect(res.status).toBe(200);
        expect(res.body.events).toHaveLength(1);
        expect(res.body.total).toBe(2);
        expect(res.body.totalPages).toBe(2);
    });

    it("hides past events from the list but not from the detail", async () => {
        const [past] = await db
            .insert(events)
            .values({
                title: `${prefix} past`,
                description: "",
                venue: "Test venue",
                startsAt: new Date(Date.now() - 3 * DAY),
                totalSeats: 10,
            })
            .returning({ id: events.id });

        const list = await request(app)
            .get("/api/events")
            .query({ search: `${prefix} past` });
        const detail = await request(app).get(`/api/events/${past.id}`);

        expect(list.body.events).toHaveLength(0);
        expect(detail.status).toBe(200);
    });

    it("returns 404 for an unknown event and 400 for a bad id", async () => {
        const unknown = await request(app).get(
            "/api/events/11111111-1111-4111-8111-111111111111",
        );
        const invalid = await request(app).get("/api/events/abc");

        expect(unknown.status).toBe(404);
        expect(invalid.status).toBe(400);
    });
});

describe("admin event management", () => {
    it("rejects create without a token (401) and as a normal user (403)", async () => {
        const anonymous = await request(app)
            .post("/api/events")
            .send(validEvent());
        const asUser = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${userToken}`)
            .send(validEvent());

        expect(anonymous.status).toBe(401);
        expect(asUser.status).toBe(403);
    });

    it("lets an admin create an event with all seats free", async () => {
        const res = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validEvent({ totalSeats: 5 }));

        expect(res.status).toBe(201);
        expect(res.body.event.seatsLeft).toBe(5);
    });

    it("rejects a past date and zero seats with 400", async () => {
        const past = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(
                validEvent({
                    startsAt: new Date(Date.now() - DAY).toISOString(),
                }),
            );
        const noSeats = await request(app)
            .post("/api/events")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validEvent({ totalSeats: 0 }));

        expect(past.status).toBe(400);
        expect(noSeats.status).toBe(400);
        expect(noSeats.body.error.details).toBeDefined();
    });

    it("updates an event as admin and blocks a normal user", async () => {
        const event = await createEvent({ title: `${prefix} update` });

        const updated = await request(app)
            .put(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validEvent({ title: `${prefix} updated`, totalSeats: 8 }));
        const asUser = await request(app)
            .put(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(validEvent());

        expect(updated.status).toBe(200);
        expect(updated.body.event.totalSeats).toBe(8);
        expect(asUser.status).toBe(403);
    });

    it("blocks reducing seats below the booked count with 409", async () => {
        const event = await createEvent({
            title: `${prefix} seats`,
            totalSeats: 3,
        });

        await addBookings(event.id, 2);

        const tooLow = await request(app)
            .put(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validEvent({ title: `${prefix} seats`, totalSeats: 1 }));
        const equal = await request(app)
            .put(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validEvent({ title: `${prefix} seats`, totalSeats: 2 }));

        expect(tooLow.status).toBe(409);
        expect(equal.status).toBe(200);
        expect(equal.body.event.seatsLeft).toBe(0);
    });

    it("blocks deleting an event that has bookings with 409", async () => {
        const event = await createEvent({ title: `${prefix} booked` });

        await addBookings(event.id, 1);

        const res = await request(app)
            .delete(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(409);
    });

    it("deletes an event without bookings and then returns 404", async () => {
        const event = await createEvent({ title: `${prefix} delete` });

        const asUser = await request(app)
            .delete(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${userToken}`);
        const deleted = await request(app)
            .delete(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${adminToken}`);
        const after = await request(app).get(`/api/events/${event.id}`);

        expect(asUser.status).toBe(403);
        expect(deleted.status).toBe(204);
        expect(after.status).toBe(404);
    });

    it("lists attendees for an admin and blocks everyone else", async () => {
        const event = await createEvent({
            title: `${prefix} attendees`,
        });
    
        await addBookings(event.id, 2);
    
        const asAdmin = await request(app)
            .get(`/api/events/${event.id}/attendees`)
            .set("Authorization", `Bearer ${adminToken}`);
        const asUser = await request(app)
            .get(`/api/events/${event.id}/attendees`)
            .set("Authorization", `Bearer ${userToken}`);
        const anonymous = await request(app).get(
            `/api/events/${event.id}/attendees`,
        );
    
        expect(asAdmin.status).toBe(200);
        expect(asAdmin.body.attendees).toHaveLength(2);
        expect(asAdmin.body.attendees[0].user.email).toBeDefined();
        expect(asUser.status).toBe(403);
        expect(anonymous.status).toBe(401);
    });

        it("returns admin stats and blocks everyone else", async () => {
        const event = await createEvent({
            title: `${prefix} stats`,
            totalSeats: 4,
        });

        await addBookings(event.id, 2);

        const asAdmin = await request(app)
            .get("/api/events/stats")
            .set("Authorization", `Bearer ${adminToken}`);
        const asUser = await request(app)
            .get("/api/events/stats")
            .set("Authorization", `Bearer ${userToken}`);
        const anonymous = await request(app).get("/api/events/stats");

        expect(asAdmin.status).toBe(200);
        expect(asAdmin.body.stats.totalBookings).toBeGreaterThanOrEqual(2);
        expect(asAdmin.body.stats.upcomingEvents).toBeGreaterThanOrEqual(1);
        expect(asAdmin.body.stats.seatFillRate).toBeGreaterThan(0);
        expect(asAdmin.body.stats.seatFillRate).toBeLessThanOrEqual(100);
        expect(asUser.status).toBe(403);
        expect(anonymous.status).toBe(401);
    });
});
