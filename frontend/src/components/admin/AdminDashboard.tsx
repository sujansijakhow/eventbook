"use client";

import Link from "next/link";

import { Alert } from "@/components/ui/Alert";
import { Button, buttonClass } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { StatCard } from "@/components/ui/StatCard";
import { useStats } from "@/hooks/useAdminEvents";
import { formatDateTime } from "@/lib/format";

export function AdminDashboard() {
    const { data, isPending, isError, error, refetch } = useStats();

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold">Admin dashboard</h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Overview of bookings and events.
                    </p>
                </div>
                <Link
                    href="/admin/events"
                    className={buttonClass("secondary")}
                >
                    Manage events
                </Link>
            </div>

            {isPending && <Spinner label="Loading dashboard…" />}

            {isError && (
                <div className="space-y-3">
                    <Alert>{error.message}</Alert>
                    <Button variant="secondary" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            {data && (
                <>
                    <div className="mb-8 grid gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Total bookings"
                            value={data.totalBookings}
                            hint="All bookings made"
                        />
                        <StatCard
                            label="Upcoming events"
                            value={data.upcomingEvents}
                            hint="Open for booking"
                        />
                        <StatCard
                            label="Seats filled"
                            value={`${data.seatFillRate}%`}
                            hint="Across upcoming events"
                        />
                    </div>

                    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <h2 className="text-[17px] font-semibold">
                                Recent bookings
                            </h2>
                            <span className="text-[13px] text-slate-500">
                                Latest 5
                            </span>
                        </div>

                        {data.recentBookings.length === 0 ? (
                            <p className="p-8 text-center text-sm text-slate-500">
                                No bookings yet.
                            </p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {data.recentBookings.map((booking) => (
                                    <li
                                        key={booking.id}
                                        className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                                    >
                                        <span
                                            aria-hidden
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
                                        >
                                            {booking.user.name
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm">
                                                <span className="font-semibold">
                                                    {booking.user.name}
                                                </span>{" "}
                                                booked{" "}
                                                <Link
                                                    href={`/events/${booking.event.id}`}
                                                    className="font-medium text-brand-700 hover:underline"
                                                >
                                                    {booking.event.title}
                                                </Link>
                                            </p>
                                            <p className="text-[13px] text-slate-500">
                                                {booking.user.email}
                                            </p>
                                        </div>
                                        <span className="text-[13px] text-slate-500">
                                            {formatDateTime(booking.bookedAt)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}