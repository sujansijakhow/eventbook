import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminEvents } from "@/components/admin/AdminEvents";
import { RequireAuth } from "@/components/shared/RequireAuth";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = { title: "Admin · EventBook" };

export default function AdminEventsPage() {
    return (
        <RequireAuth role="admin">
            <Suspense fallback={<Spinner />}>
                <AdminEvents />
            </Suspense>
        </RequireAuth>
    );
}