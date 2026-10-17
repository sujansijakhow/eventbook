"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { BookingPanel } from "@/components/events/BookingPanel";
import {
    getSeatState,
    seatBarColors,
    SeatsBadge,
} from "@/components/events/SeatsBadge";
import { Alert } from "@/components/ui/Alert";
import { DateChip } from "@/components/ui/DateChip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Spinner } from "@/components/ui/Spinner";
import { useEvent } from "@/hooks/useEvents";
import { ApiError } from "@/lib/api";
import {
    dateChipParts,
    formatLongDate,
    formatTime,
} from "@/lib/format";

export function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const { data: event, isPending, isError, error } = useEvent(id);

    if (isPending) {
        return <Spinner label="Loading event…" />;
    }

    if (isError) {
        const missing =
            error instanceof ApiError &&
            (error.status === 404 || error.status === 400);

        return (
            <div className="mx-auto max-w-md space-y-3 py-12">
                <Alert>
                    {missing
                        ? "We couldn't find that event."
                        : error.message}
                </Alert>
                <Link
                    href="/"
                    className="text-sm font-medium text-brand-700 hover:underline"
                >
                    ← All events
                </Link>
            </div>
        );
    }

    const { month, day } = dateChipParts(event.startsAt);
    const booked = event.totalSeats - event.seatsLeft;
    const ended = new Date(event.startsAt) <= new Date();
    const badge = ended
        ? { label: "Ended", tone: "ended" as const }
        : getSeatState(event.seatsLeft, event.totalSeats);

    return (
        <div>
            <Link
                href="/"
                className="text-sm font-medium text-brand-700 hover:underline"
            >
                ← All events
            </Link>

            <div className="mt-5 mb-6 flex flex-wrap items-center gap-4">
                <DateChip month={month} day={day} />
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold">{event.title}</h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Hosted at {event.venue}
                    </p>
                </div>
                <SeatsBadge label={badge.label} tone={badge.tone} />
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
                    <h2 className="text-[17px] font-semibold">
                        About this event
                    </h2>
                    <p className="mt-3 mb-6 leading-relaxed whitespace-pre-line text-slate-700">
                        {event.description || "No description provided."}
                    </p>

                    <h2 className="text-[17px] font-semibold">Details</h2>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                            <Calendar size={14} aria-hidden />
                            {formatLongDate(event.startsAt)}
                        </li>
                        <li className="flex items-center gap-2">
                            <Clock size={14} aria-hidden />
                            {formatTime(event.startsAt)}
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={14} aria-hidden />
                            {event.venue}
                        </li>
                    </ul>
                </section>

                <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                    <p className="text-sm text-slate-500">Seats left</p>
                    <p className="mt-1 mb-3.5 text-3xl font-bold">
                        {event.seatsLeft}{" "}
                        <span className="text-sm font-normal text-slate-500">
                            of {event.totalSeats}
                        </span>
                    </p>
                    <ProgressBar
                        value={booked}
                        max={event.totalSeats}
                        barClassName={seatBarColors[badge.tone]}
                    />
                    <p className="mt-2 mb-5 text-[13px] text-slate-500">
                        {booked} of {event.totalSeats} booked
                    </p>
                    <BookingPanel
                        eventId={event.id}
                        seatsLeft={event.seatsLeft}
                        ended={ended}
                    />
                </aside>
            </div>
        </div>
    );
}