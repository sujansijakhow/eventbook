import { Pencil, Trash2 } from "lucide-react";

import { getSeatState, seatBarColors } from "@/components/events/SeatsBadge";
import { Button } from "@/components/ui/Button";
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
                <thead className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Event</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Booked</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
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
                                        barClassName={seatBarColors[tone]}
                                    />
                                    <p className="mt-1.5 text-[13px] text-slate-500">
                                        {booked} / {event.totalSeats}
                                    </p>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                    <div className="flex gap-2">
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