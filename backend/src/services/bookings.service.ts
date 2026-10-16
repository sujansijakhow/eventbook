import { and, count, eq, asc } from "drizzle-orm";

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

export async function listUserBookings(userId: string) {
    return db
        .select({
            id: bookings.id,
            createdAt: bookings.createdAt,
            event: {
                id: events.id,
                title: events.title,
                venue: events.venue,
                startsAt: events.startsAt,
            },
        })
        .from(bookings)
        .innerJoin(events, eq(events.id, bookings.eventId))
        .where(eq(bookings.userId, userId))
        .orderBy(asc(events.startsAt));
}

export async function cancelBooking(
    userId: string,
    bookingId: string,
) {
    const [booking] = await db
        .select({
            userId: bookings.userId,
            startsAt: events.startsAt,
        })
        .from(bookings)
        .innerJoin(events, eq(events.id, bookings.eventId))
        .where(eq(bookings.id, bookingId));

    if (!booking) {
        throw new HttpError(404, "Booking not found");
    }

    if (booking.userId !== userId) {
        throw new HttpError(
            403,
            "You can only cancel your own bookings",
        );
    }

    if (booking.startsAt <= new Date()) {
        throw new HttpError(
            409,
            "Cannot cancel a booking for a past event",
        );
    }

    await db.delete(bookings).where(eq(bookings.id, bookingId));
}