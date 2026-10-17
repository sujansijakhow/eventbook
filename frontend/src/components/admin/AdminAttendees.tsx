"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { AttendeeTable } from "@/components/admin/AttendeeTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAttendees } from "@/hooks/useAdminEvents";
import { formatDateTime } from "@/lib/format";

type Props = {
    eventId: string;
};

export function AdminAttendees({ eventId }: Props) {
    const { data, isPending, isError, error, refetch } =
        useAttendees(eventId);

    return (
        <div>
            <Link
                href="/admin/events"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
            >
                <ArrowLeft size={14} aria-hidden />
                Back to events
            </Link>

            {isPending && <Spinner label="Loading attendees…" />}

            {isError && (
                <div className="space-y-3">
                    <Alert>{error.message}</Alert>
                    <Button variant="secondary" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            {data && (
                <>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                            {data.event.title}
                        </h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            {data.event.venue} ·{" "}
                            {formatDateTime(data.event.startsAt)} ·{" "}
                            {data.event.totalSeats - data.event.seatsLeft} /{" "}
                            {data.event.totalSeats} seats booked
                        </p>
                    </div>

                    {data.attendees.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                            No one has booked this event yet.
                        </div>
                    ) : (
                        <AttendeeTable attendees={data.attendees} />
                    )}
                </>
            )}
        </div>
    );
}