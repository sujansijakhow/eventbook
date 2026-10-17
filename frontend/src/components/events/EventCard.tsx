import { Clock, MapPin } from "lucide-react";
import Link from "next/link";

import {
    getSeatState,
    seatBarColors,
    SeatsBadge,
} from "@/components/events/SeatsBadge";
import { DateChip } from "@/components/ui/DateChip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { dateChipParts, formatDateTime } from "@/lib/format";
import type { EventItem } from "@/types";

export function EventCard({ event }: { event: EventItem }) {
    const { month, day } = dateChipParts(event.startsAt);
    const state = getSeatState(event.seatsLeft, event.totalSeats);
    const booked = event.totalSeats - event.seatsLeft;

    return (
        <Link
            href={`/events/${event.id}`}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
            <div className="flex items-start justify-between">
                <DateChip month={month} day={day} />
                <SeatsBadge label={state.label} tone={state.tone} />
            </div>

            <h3 className="mt-3.5 mb-2.5 text-[17px] font-semibold">
                {event.title}
            </h3>
            <p className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={14} aria-hidden />
                {formatDateTime(event.startsAt)}
            </p>
            <p className="mt-1.5 mb-4 flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={14} aria-hidden />
                {event.venue}
            </p>

            <div className="-mx-5 mt-auto border-t border-slate-200 px-5 pt-3.5">
                <ProgressBar
                    value={booked}
                    max={event.totalSeats}
                    barClassName={seatBarColors[state.tone]}
                />
                <div className="mt-2.5 flex justify-between text-[13px]">
                    <span className="text-slate-500">
                        {booked} of {event.totalSeats} booked
                    </span>
                    <span className="font-semibold text-brand-700 group-hover:underline">
                        View details
                    </span>
                </div>
            </div>
        </Link>
    );
}