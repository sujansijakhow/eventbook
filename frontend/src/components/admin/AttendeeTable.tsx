import { formatDateTime } from "@/lib/format";
import type { Attendee } from "@/types";

type Props = {
    attendees: Attendee[];
};

export function AttendeeTable({ attendees }: Props) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                    <tr>
                        <th className="px-4 py-3 font-semibold">#</th>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Booked</th>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee, index) => (
                        <tr
                            key={attendee.bookingId}
                            className="border-b border-slate-100 last:border-0"
                        >
                            <td className="px-4 py-3.5 text-slate-500">
                                {index + 1}
                            </td>
                            <td className="px-4 py-3.5 font-semibold">
                                {attendee.user.name}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">
                                {attendee.user.email}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                                {formatDateTime(attendee.bookedAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}