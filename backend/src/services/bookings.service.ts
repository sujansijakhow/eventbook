import { and, count, eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { bookings, events } from "../db/schema.js";
import { HttpError } from "../lib/httpError.js";

export async function createBooking(
    userId: string,
    eventId: string,
) {
    return db.transaction(async (tx) => {
        const [event] = await tx
            .select({
                startsAt: events.startsAt,
                totalSeats: events.totalSeats,
            })
            .from(events)
            .where(eq(events.id, eventId))
            .for("update");

        if (!event) {
            throw new HttpError(404, "Event not found");
        }

        if (event.startsAt <= new Date()) {
            throw new HttpError(409, "Cannot book a past event");
        }

        const [existing] = await tx
            .select({ id: bookings.id })
            .from(bookings)
            .where(
                and(
                    eq(bookings.userId, userId),
                    eq(bookings.eventId, eventId),
                ),
            );

        if (existing) {
            throw new HttpError(
                409,
                "You have already booked this event",
            );
        }

        const [{ booked }] = await tx
            .select({ booked: count() })
            .from(bookings)
            .where(eq(bookings.eventId, eventId));

        if (booked >= event.totalSeats) {
            throw new HttpError(409, "Event is full");
        }

        const [booking] = await tx
            .insert(bookings)
            .values({ userId, eventId })
            .returning({
                id: bookings.id,
                eventId: bookings.eventId,
                createdAt: bookings.createdAt,
            });

        return {
            ...booking,
            seatsLeft: event.totalSeats - booked - 1,
        };
    });
}