import { Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";

import { getSeatState, seatBarColors } from "@/components/events/SeatsBadge";
import { Button, buttonClass } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDateTime } from "@/lib/format";
import type { EventItem } from "@/types";

type Props = {
    events: EventItem[];
    onEdit: (event: EventItem) => void;
    onDelete: (event: EventItem) => void;
};

export function AdminEventTable({ events, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/60 text-xs tracking-wide text-slate-500 uppercase">
                    <tr>
                        <th className="w-[30%] px-6 py-3.5 font-semibold">
                            Event
                        </th>
                        <th className="px-6 py-3.5 font-semibold">Date</th>
                        <th className="px-6 py-3.5 font-semibold">Booked</th>
                        <th className="px-6 py-3.5 text-right font-semibold">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => {
                        const booked = event.totalSeats - event.seatsLeft;
                        const tone = getSeatState(
                            event.seatsLeft,
                            event.totalSeats,
                        ).tone;

                        return (
                            <tr
                                key={event.id}
                                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60"
                            >
                                <td className="px-6 py-4">
                                    <p className="font-semibold">
                                        {event.title}
                                    </p>
                                    <p className="mt-0.5 text-[13px] text-slate-500">
                                        {event.venue}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                    {formatDateTime(event.startsAt)}
                                </td>
                                <td className="min-w-48 px-6 py-4">
                                    <ProgressBar
                                        value={booked}
                                        max={event.totalSeats}
                                        barClassName={seatBarColors[tone]}
                                    />
                                    <p className="mt-1.5 text-[13px] text-slate-500">
                                        {booked} / {event.totalSeats}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/events/${event.id}/attendees`}
                                            className={buttonClass(
                                                "secondary",
                                                "sm",
                                            )}
                                        >
                                            <Users size={14} aria-hidden />
                                            Attendees
                                        </Link>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => onEdit(event)}
                                        >
                                            <Pencil size={14} aria-hidden />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => onDelete(event)}
                                        >
                                            <Trash2 size={14} aria-hidden />
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
    );
}