"use client";

import { useSearchParams } from "next/navigation";

import { AdminEventTable } from "@/components/admin/AdminEventTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { useEvents } from "@/hooks/useEvents";
import type { EventItem } from "@/types";

type Props = {
    onEdit: (event: EventItem) => void;
    onDelete: (event: EventItem) => void;
};

export function AdminEventResults({ onEdit, onDelete }: Props) {
    const searchParams = useSearchParams();
    const search = (searchParams.get("search") ?? "").trim();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const { data, isPending, isError, error, refetch, isPlaceholderData } =
        useEvents({ search, page });

    if (isPending) {
        return <Spinner label="Loading events…" />;
    }

    if (isError) {
        return (
            <div className="mt-8 space-y-3">
                <Alert>{error.message}</Alert>
                <Button variant="secondary" onClick={() => refetch()}>
                    Try again
                </Button>
            </div>
        );
    }

    function hrefFor(target: number) {
        const query = new URLSearchParams();

        if (search) {
            query.set("search", search);
        }

        if (target > 1) {
            query.set("page", String(target));
        }

        const text = query.toString();

        return text ? `/admin/events?${text}` : "/admin/events";
    }

    return (
        <>
            <div className="mt-7 mb-4 flex justify-between text-[13px] text-slate-500">
                <span>
                    Showing {data.events.length} of {data.total} upcoming
                    events
                </span>
                <span>Sorted by date</span>
            </div>

            {data.events.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                    {search
                        ? `No upcoming events match "${search}".`
                        : "No upcoming events. Create one with New event."}
                </div>
            ) : (
                <div className={isPlaceholderData ? "opacity-60" : ""}>
                    <AdminEventTable
                        events={data.events}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            )}

            <Pagination
                page={data.page}
                totalPages={data.totalPages}
                hrefFor={hrefFor}
            />
        </>
    );
}