import type { Metadata } from "next";

import { AdminAttendees } from "@/components/admin/AdminAttendees";
import { RequireAuth } from "@/components/shared/RequireAuth";

export const metadata: Metadata = { title: "Attendees · EventBook" };

type Props = {
    params: Promise<{ id: string }>;
};

export default async function AttendeesPage({ params }: Props) {
    const { id } = await params;

    return (
        <RequireAuth role="admin">
            <AdminAttendees eventId={id} />
        </RequireAuth>
    );
}