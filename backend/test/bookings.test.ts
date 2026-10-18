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

const prefix = `test-bookings-${randomUUID().slice(0, 8)}`;
const DAY = 24 * 60 * 60 * 1000;

let tokens: string[];
let openEventId: string;
let smallEventId: string;
let mineEventId: string;
let cancelEventId: string;
let pastEventId: string;
let pastBookingId: string;

function book(token: string, eventId: string) {
    return request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({ eventId });
}

function cancel(token: string, bookingId: string) {
    return request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${token}`);
}

function myBookings(token: string) {
    return request(app)
        .get("/api/bookings/me")
        .set("Authorization", `Bearer ${token}`);
}

async function seatsLeft(eventId: string) {
    const res = await request(app).get(`/api/events/${eventId}`);

    return res.body.event.seatsLeft as number;
}
async function createToken(name: string) {
    const [user] = await db
        .insert(users)
        .values({
            name: `Test ${name}`,
            email: `${prefix}-${name}@example.com`,
            passwordHash: "not-a-real-hash",
        })
        .returning({ id: users.id });

    return jwt.sign({ role: "user" }, env.JWT_SECRET, {
        subject: user.id,
    });
}

beforeAll(async () => {
    const createdUsers = await db
        .insert(users)
        .values(
            ["a", "b", "c"].map((name) => ({
                name: `Test ${name}`,
                email: `${prefix}-${name}@example.com`,
                passwordHash: "not-a-real-hash",
            })),
        )
        .returning({ id: users.id });

    tokens = createdUsers.map((user) =>
        jwt.sign({ role: "user" }, env.JWT_SECRET, {
            subject: user.id,
        }),
    );

    const future = new Date(Date.now() + 7 * DAY);
    const eventRows = (title: string, totalSeats: number) => ({
        title: `${prefix} ${title}`,
        description: "",
        venue: "Test venue",
        startsAt: future,
        totalSeats,
    });

    const [open, small, mine, cancelEvent, past] = await db
        .insert(events)
        .values([
            eventRows("open", 5),
            eventRows("small", 2),
            eventRows("mine", 5),
            eventRows("cancel", 5),
            {
                ...eventRows("past", 5),
                startsAt: new Date(Date.now() - 3 * DAY),
            },
        ])
        .returning({ id: events.id });

    openEventId = open.id;
    smallEventId = small.id;
    mineEventId = mine.id;
    cancelEventId = cancelEvent.id;
    pastEventId = past.id;

    const [pastBooking] = await db
        .insert(bookings)
        .values({
            userId: createdUsers[0].id,
            eventId: pastEventId,
        })
        .returning({ id: bookings.id });

    pastBookingId = pastBooking.id;
});

afterAll(async () => {
    // deleting users also deletes their bookings (cascade)
    await db.delete(users).where(like(users.email, `${prefix}%`));
    await db.delete(events).where(like(events.title, `${prefix}%`));
});

describe("create booking", () => {
    it("books a seat and reduces seats left", async () => {
        const res = await book(tokens[0], openEventId);

        expect(res.status).toBe(201);
        expect(res.body.booking.seatsLeft).toBe(4);
        expect(await seatsLeft(openEventId)).toBe(4);
    });

    it("rejects booking the same event twice with 409", async () => {
        const res = await book(tokens[0], openEventId);

        expect(res.status).toBe(409);
    });

    it("rejects booking a full event with 409", async () => {
        const first = await book(tokens[0], smallEventId);
        const second = await book(tokens[1], smallEventId);
        const third = await book(tokens[2], smallEventId);

        expect(first.status).toBe(201);
        expect(second.status).toBe(201);
        expect(third.status).toBe(409);
        expect(third.body.error.message).toBe("Event is full");
    });

    it("rejects booking a past event with 409", async () => {
        const res = await book(tokens[1], pastEventId);

        expect(res.status).toBe(409);
    });

    it("rejects a missing token, a bad body and an unknown event", async () => {
        const anonymous = await request(app)
            .post("/api/bookings")
            .send({ eventId: openEventId });
        const invalidId = await book(tokens[0], "abc");
        const noBody = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${tokens[0]}`)
            .send({});
        const unknown = await book(
            tokens[0],
            "11111111-1111-4111-8111-111111111111",
        );

        expect(anonymous.status).toBe(401);
        expect(invalidId.status).toBe(400);
        expect(noBody.status).toBe(400);
        expect(unknown.status).toBe(404);
    });

        it("rejects booking as an admin with 403", async () => {
        const [admin] = await db
            .insert(users)
            .values({
                name: "Test admin",
                email: `${prefix}-admin@example.com`,
                passwordHash: "not-a-real-hash",
                role: "admin",
            })
            .returning({ id: users.id });

        const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
            subject: admin.id,
        });
        const res = await book(token, openEventId);

        expect(res.status).toBe(403);
    });

        it("never oversells the last seat when two users book at once", async () => {
        const [lastSeat] = await db
            .insert(events)
            .values({
                title: `${prefix} last seat`,
                description: "",
                venue: "Test venue",
                startsAt: new Date(Date.now() + 7 * DAY),
                totalSeats: 1,
            })
            .returning({ id: events.id });

        const [tokenA, tokenB] = await Promise.all([
            createToken("race-a"),
            createToken("race-b"),
        ]);

        const [first, second] = await Promise.all([
            book(tokenA, lastSeat.id),
            book(tokenB, lastSeat.id),
        ]);

        expect([first.status, second.status].sort()).toEqual([201, 409]);
        expect(await seatsLeft(lastSeat.id)).toBe(0);
    });
});

describe("my bookings", () => {
    it("lists only the caller's own bookings", async () => {
        await book(tokens[2], mineEventId);

        const res = await myBookings(tokens[2]);

        expect(res.status).toBe(200);
        expect(res.body.bookings).toHaveLength(1);
        expect(res.body.bookings[0].event.title).toBe(
            `${prefix} mine`,
        );
    });

    it("returns an empty list for a user with no bookings", async () => {
        const [fresh] = await db
            .insert(users)
            .values({
                name: "Test fresh",
                email: `${prefix}-fresh@example.com`,
                passwordHash: "not-a-real-hash",
            })
            .returning({ id: users.id });

        const token = jwt.sign({ role: "user" }, env.JWT_SECRET, {
            subject: fresh.id,
        });
        const res = await myBookings(token);

        expect(res.status).toBe(200);
        expect(res.body.bookings).toEqual([]);
    });

    it("rejects a missing token with 401", async () => {
        const res = await request(app).get("/api/bookings/me");

        expect(res.status).toBe(401);
    });
});

describe("cancel booking", () => {
    it("cancels an own booking and frees the seat", async () => {
        const booked = await book(tokens[0], cancelEventId);

        expect(await seatsLeft(cancelEventId)).toBe(4);

        const res = await cancel(tokens[0], booked.body.booking.id);

        expect(res.status).toBe(204);
        expect(await seatsLeft(cancelEventId)).toBe(5);
    });

    it("allows booking again after cancelling", async () => {
        const res = await book(tokens[0], cancelEventId);

        expect(res.status).toBe(201);
    });

    it("does not let a user cancel someone else's booking", async () => {
        const mine = await myBookings(tokens[0]);
        const target = mine.body.bookings.find(
            (b: { event: { id: string } }) =>
                b.event.id === cancelEventId,
        );

        const res = await cancel(tokens[1], target.id);
        const after = await myBookings(tokens[0]);

        expect(res.status).toBe(403);
        expect(
            after.body.bookings.some(
                (b: { id: string }) => b.id === target.id,
            ),
        ).toBe(true);
    });

    it("does not cancel a booking for a past event", async () => {
        const res = await cancel(tokens[0], pastBookingId);

        expect(res.status).toBe(409);
    });

    it("rejects an unknown booking, a bad id and a missing token", async () => {
        const unknown = await cancel(
            tokens[0],
            "11111111-1111-4111-8111-111111111111",
        );
        const invalid = await cancel(tokens[0], "abc");
        const anonymous = await request(app).delete(
            `/api/bookings/${pastBookingId}`,
        );

        expect(unknown.status).toBe(404);
        expect(invalid.status).toBe(400);
        expect(anonymous.status).toBe(401);
    });
});