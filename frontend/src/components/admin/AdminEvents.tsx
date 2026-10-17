"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { EventForm } from "@/components/events/EventForm";
import { getSeatState, seatBarColors } from "@/components/events/SeatsBadge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Spinner } from "@/components/ui/Spinner";
import { StatCard } from "@/components/ui/StatCard";
import {
    useCreateEvent,
    useDeleteEvent,
    useStats,
    useUpdateEvent,
} from "@/hooks/useAdminEvents";
import { useEvents } from "@/hooks/useEvents";
import { formatDateTime } from "@/lib/format";
import type { EventInput, EventItem } from "@/types";

export function AdminEvents() {
    const page = Math.max(1, Number(useSearchParams().get("page")) || 1);
    const events = useEvents({ search: "", page });
    const stats = useStats();
    const create = useCreateEvent();
    const update = useUpdateEvent();
    const remove = useDeleteEvent();

    const [editing, setEditing] = useState<EventItem | "new" | null>(null);
    const [deleting, setDeleting] = useState<EventItem | null>(null);

    const saving = editing === "new" ? create : update;

    function closeForm() {
        setEditing(null);
        create.reset();
        update.reset();
    }

    function closeDelete() {
        setDeleting(null);
        remove.reset();
    }

    function handleSubmit(input: EventInput) {
        if (editing === "new") {
            create.mutate(input, { onSuccess: closeForm });
        } else if (editing) {
            update.mutate({ id: editing.id, input }, { onSuccess: closeForm });
        }
    }

    function handleDelete() {
        if (deleting) {
            remove.mutate(deleting.id, { onSuccess: closeDelete });
        }
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold">Admin dashboard</h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Overview of bookings and events.
                    </p>
                </div>
                <Button onClick={() => setEditing("new")}>
                    <Plus size={16} aria-hidden />
                    New event
                </Button>
            </div>

            {stats.isError && (
                <div className="mb-4">
                    <Alert>{stats.error.message}</Alert>
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total bookings"
                    value={stats.data?.totalBookings}
                    hint="All bookings made"
                />
                <StatCard
                    label="Upcoming events"
                    value={stats.data?.upcomingEvents}
                    hint="Open for booking"
                />
                <StatCard
                    label="Seats filled"
                    value={
                        stats.data ? `${stats.data.seatFillRate}%` : undefined
                    }
                    hint="Across upcoming events"
                />
            </div>

            {events.isPending && <Spinner label="Loading events…" />}

            {events.isError && (
                <div className="space-y-3">
                    <Alert>{events.error.message}</Alert>
                    <Button
                        variant="secondary"
                        onClick={() => events.refetch()}
                    >
                        Try again
                    </Button>
                </div>
            )}

            {events.data && events.data.events.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                    No upcoming events. Create one with New event.
                </div>
            )}

            {events.data && events.data.events.length > 0 && (
                <>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">
                                        Event
                                    </th>
                                    <th className="px-4 py-3 font-semibold">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 font-semibold">
                                        Booked
                                    </th>
                                    <th className="px-4 py-3 font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.data.events.map((event) => {
                                    const booked =
                                        event.totalSeats - event.seatsLeft;
                                    const tone = getSeatState(
                                        event.seatsLeft,
                                        event.totalSeats,
                                    ).tone;

                                    return (
                                        <tr
                                            key={event.id}
                                            className="border-b border-slate-100 last:border-0"
                                        >
                                            <td className="px-4 py-3.5">
                                                <p className="font-semibold">
                                                    {event.title}
                                                </p>
                                                <p className="text-[13px] text-slate-500">
                                                    {event.venue}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                                                {formatDateTime(event.startsAt)}
                                            </td>
                                            <td className="min-w-36 px-4 py-3.5">
                                                <ProgressBar
                                                    value={booked}
                                                    max={event.totalSeats}
                                                    barClassName={
                                                        seatBarColors[tone]
                                                    }
                                                />
                                                <p className="mt-1.5 text-[13px] text-slate-500">
                                                    {booked} /{" "}
                                                    {event.totalSeats}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() =>
                                                            setEditing(event)
                                                        }
                                                    >
                                                        <Pencil
                                                            size={14}
                                                            aria-hidden
                                                        />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() =>
                                                            setDeleting(event)
                                                        }
                                                    >
                                                        <Trash2
                                                            size={14}
                                                            aria-hidden
                                                        />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={events.data.page}
                        totalPages={events.data.totalPages}
                        hrefFor={(target) =>
                            target > 1
                                ? `/admin/events?page=${target}`
                                : "/admin/events"
                        }
                    />
                </>
            )}

            <Modal
                open={editing !== null}
                onClose={closeForm}
                title={editing === "new" ? "New event" : "Edit event"}
            >
                {editing && (
                    <EventForm
                        key={editing === "new" ? "new" : editing.id}
                        initial={editing === "new" ? undefined : editing}
                        submitLabel={
                            editing === "new" ? "Create event" : "Save changes"
                        }
                        pending={saving.isPending}
                        error={saving.error}
                        onSubmit={handleSubmit}
                        onCancel={closeForm}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={deleting !== null}
                title="Delete this event?"
                message={`"${deleting?.title ?? ""}" will be permanently deleted. Events that have bookings can't be deleted.`}
                confirmLabel="Delete event"
                pending={remove.isPending}
                error={remove.error?.message}
                onConfirm={handleDelete}
                onClose={closeDelete}
            />
        </div>
    );
}
