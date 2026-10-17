import type { Metadata } from "next";

import { MyBookings } from "@/components/bookings/MyBookings";
import { RequireAuth } from "@/components/shared/RequireAuth";

export const metadata: Metadata = { title: "My bookings · EventBook" };

export default function MyBookingsPage() {
    return (
        <RequireAuth>
            <MyBookings />
        </RequireAuth>
    );
}