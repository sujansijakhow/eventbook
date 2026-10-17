"use client";

import Link from "next/link";

import { Alert } from "@/components/ui/Alert";
import { Button, buttonClass } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useBookEvent, useMyBookings } from "@/hooks/useBookings";

type Props = {
    eventId: string;
    seatsLeft: number;
    ended: boolean;
};

export function BookingPanel({ eventId, seatsLeft, ended }: Props) {
    const { user, loading } = useAuth();
    const isAdmin = user?.role === "admin";
    const myBookings = useMyBookings(Boolean(user) && !isAdmin);
    const booking = useBookEvent(eventId);

    if (isAdmin) {
        return (
            <div className="space-y-3">
                <Link
                    href={`/admin/events/${eventId}/attendees`}
                    className={`${buttonClass("primary")} w-full`}
                >
                    View attendees
                </Link>
                <p className="text-[13px] text-slate-500">
                    Admins manage events and cannot book seats.{" "}
                    <Link
                        href="/admin/events"
                        className="font-medium text-brand-700 hover:underline"
                    >
                        Manage events
                    </Link>
                </p>
            </div>
        );
    }

    const checking = loading || (Boolean(user) && myBookings.isPending);
    const alreadyBooked =
        myBookings.data?.some((item) => item.event.id === eventId) ?? false;

    if (booking.isSuccess) {
        return (
            <div className="space-y-3">
                <Alert variant="success">Seat booked. See you there!</Alert>
                <Link
                    href="/my-bookings"
                    className={`${buttonClass("secondary")} w-full`}
                >
                    View my bookings
                </Link>
            </div>
        );
    }

    const unavailable = ended
        ? "Event ended"
        : alreadyBooked
          ? "Already booked"
          : seatsLeft <= 0
            ? "Sold out"
            : null;

    return (
        <div className="space-y-3">
            {booking.isError && <Alert>{booking.error.message}</Alert>}

            {unavailable ? (
                <Button className="w-full" disabled>
                    {unavailable}
                </Button>
            ) : !checking && !user ? (
                <Link
                    href="/login"
                    className={`${buttonClass("primary")} w-full`}
                >
                    Log in to book
                </Link>
            ) : (
                <Button
                    className="w-full"
                    disabled={checking || booking.isPending}
                    onClick={() => booking.mutate()}
                >
                    {booking.isPending ? "Booking…" : "Book a seat"}
                </Button>
            )}

            {alreadyBooked && !ended ? (
                <p className="text-[13px] text-slate-500">
                    You have a seat.{" "}
                    <Link
                        href="/my-bookings"
                        className="font-medium text-brand-700 hover:underline"
                    >
                        Manage it in My bookings
                    </Link>
                    .
                </p>
            ) : (
                <p className="text-[13px] text-slate-500">
                    One seat per booking. Cancel any time from My bookings.
                </p>
            )}
        </div>
    );
}
