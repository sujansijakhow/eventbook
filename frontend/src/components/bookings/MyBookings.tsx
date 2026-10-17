"use client";

import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SeatsBadge } from "@/components/events/SeatsBadge";
import { Alert } from "@/components/ui/Alert";
import { Button, buttonClass } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DateChip } from "@/components/ui/DateChip";
import { Spinner } from "@/components/ui/Spinner";
import { useCancelBooking, useMyBookings } from "@/hooks/useBookings";
import { dateChipParts, formatDateTime } from "@/lib/format";
import type { Booking } from "@/types";

function BookingRow({
    booking,
    onCancel,
}: {
    booking: Booking;
    onCancel?: () => void;
}) {
    const { event } = booking;
    const { month, day } = dateChipParts(event.startsAt);

    return (
        <li className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <DateChip month={month} day={day} />
            <div className="min-w-0 flex-1">
                <Link
                    href={`/events/${event.id}`}
                    className="text-[17px] font-semibold hover:text-brand-700 hover:underline"
                >
                    {event.title}
                </Link>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} aria-hidden />
                    {formatDateTime(event.startsAt)}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} aria-hidden />
                    {event.venue}
                </p>
            </div>
            {onCancel ? (
                <Button 
                    className="cursor-pointer"
                    variant="danger" onClick={onCancel}>
                    Cancel booking
                </Button>
            ) : (
                <SeatsBadge label="Ended" tone="ended" />
            )}
        </li>
    );
}

export function MyBookings() {
    const { data, isPending, isError, error, refetch } = useMyBookings();
    const cancel = useCancelBooking();
    const [target, setTarget] = useState<Booking | null>(null);

    function closeDialog() {
        setTarget(null);
        cancel.reset();
    }

    function confirmCancel() {
        if (target) {
            cancel.mutate(target.id, { onSuccess: closeDialog });
        }
    }

    const bookings = data ?? [];
    const now = new Date();
    const upcoming = bookings.filter(
        (booking) => new Date(booking.event.startsAt) > now,
    );
    const past = bookings.filter(
        (booking) => new Date(booking.event.startsAt) <= now,
    );

    return (
        <div>
            <h1 className="text-3xl font-bold">My bookings</h1>
            <p className="mt-1.5 mb-6 text-sm text-slate-500">
                Your seats. Cancel any time before the event starts.
            </p>

            {isPending && <Spinner label="Loading your bookings…" />}

            {isError && (
                <div className="space-y-3">
                    <Alert>{error.message}</Alert>
                    <Button variant="secondary" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            {data && bookings.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                    <p className="text-slate-500">
                        You haven&apos;t booked anything yet.
                    </p>
                    <Link
                        href="/"
                        className={`${buttonClass("primary")} mt-4`}
                    >
                        Browse events
                    </Link>
                </div>
            )}

            {upcoming.length > 0 && (
                <section>
                    <h2 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Upcoming
                    </h2>
                    <ul className="space-y-3">
                        {upcoming.map((booking) => (
                            <BookingRow
                                key={booking.id}
                                booking={booking}
                                onCancel={() => setTarget(booking)}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {past.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Past
                    </h2>
                    <ul className="space-y-3">
                        {past.map((booking) => (
                            <BookingRow key={booking.id} booking={booking} />
                        ))}
                    </ul>
                </section>
            )}

            <ConfirmDialog
                open={target !== null}
                title="Cancel this booking?"
                message={`Your seat for "${target?.event.title ?? ""}" will be released, and you can book it again later.`}
                confirmLabel="Cancel booking"
                pending={cancel.isPending}
                error={cancel.error?.message}
                onConfirm={confirmCancel}
                onClose={closeDialog}
            />
        </div>
    );
}