import { and, asc, count, eq, gt, ilike, sql } from "drizzle-orm";

import { db } from "../db/db.js";
import { bookings, events, users } from "../db/schema.js";
import { HttpError } from "../lib/httpError.js";
import type {
    EventInput,
    ListEventsQuery,
} from "../schemas/event.schema.js";

const eventColumns = {
    id: events.id,
    title: events.title,
    description: events.description,
    venue: events.venue,
    startsAt: events.startsAt,
    totalSeats: events.totalSeats,
    seatsLeft: sql<number>`${events.totalSeats} - count(${bookings.id})::int`,
};

export async function listUpcomingEvents({
    search,
    page,
    limit,
}: ListEventsQuery) {
    const where = and(
        gt(events.startsAt, new Date()),
        search ? ilike(events.title, `%${search}%`) : undefined,
    );

    const [rows, [{ total }]] = await Promise.all([
        db
            .select(eventColumns)
            .from(events)
            .leftJoin(bookings, eq(bookings.eventId, events.id))
            .where(where)
            .groupBy(events.id)
            .orderBy(asc(events.startsAt))
            .limit(limit)
            .offset((page - 1) * limit),
        db.select({ total: count() }).from(events).where(where),
    ]);

    return {
        events: rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

export async function getEvent(id: string) {
    const [event] = await db
        .select(eventColumns)
        .from(events)
        .leftJoin(bookings, eq(bookings.eventId, events.id))
        .where(eq(events.id, id))
        .groupBy(events.id);

    if (!event) {
        throw new HttpError(404, "Event not found");
    }

    return event;
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function lockEventAndCountBookings(tx: Tx, id: string) {
    const [event] = await tx
        .select({ id: events.id })
        .from(events)
        .where(eq(events.id, id))
        .for("update");

    if (!event) {
        throw new HttpError(404, "Event not found");
    }

    const [{ booked }] = await tx
        .select({ booked: count() })
        .from(bookings)
        .where(eq(bookings.eventId, id));

    return booked;
}

export async function createEvent(input: EventInput) {
    const [created] = await db
        .insert(events)
        .values(input)
        .returning({ id: events.id });

    return getEvent(created.id);
}

export async function updateEvent(id: string, input: EventInput) {
    await db.transaction(async (tx) => {
        const booked = await lockEventAndCountBookings(tx, id);

        if (input.totalSeats < booked) {
            throw new HttpError(
                409,
                `Cannot reduce seats below the ${booked} already booked`,
            );
        }

        await tx.update(events).set(input).where(eq(events.id, id));
    });

    return getEvent(id);
}

export async function deleteEvent(id: string) {
    await db.transaction(async (tx) => {
        const booked = await lockEventAndCountBookings(tx, id);

        if (booked > 0) {
            throw new HttpError(
                409,
                `Cannot delete an event with ${booked} booking(s)`,
            );
        }

        await tx.delete(events).where(eq(events.id, id));
    });
}

export async function listAttendees(eventId: string) {
    const event = await getEvent(eventId);

    const attendees = await db
        .select({
            bookingId: bookings.id,
            bookedAt: bookings.createdAt,
            user: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
        .from(bookings)
        .innerJoin(users, eq(users.id, bookings.userId))
        .where(eq(bookings.eventId, eventId))
        .orderBy(asc(bookings.createdAt));

    return { event, attendees };
}