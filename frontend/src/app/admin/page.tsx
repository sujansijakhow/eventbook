import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { RequireAuth } from "@/components/shared/RequireAuth";

export const metadata: Metadata = { title: "Dashboard · EventBook" };

export default function AdminPage() {
    return (
        <RequireAuth role="admin">
            <AdminDashboard />
        </RequireAuth>
    );
}