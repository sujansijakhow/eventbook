export type Role = "user" | "admin";

export type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
};

export type EventItem = {
    id: string;
    title: string;
    description: string;
    venue: string;
    startsAt: string;
    totalSeats: number;
    seatsLeft: number;
};

export type EventsPage = {
    events: EventItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type Booking = {
    id: string;
    createdAt: string;
    event: {
        id: string;
        title: string;
        venue: string;
        startsAt: string;
    };
};

export type Attendee = {
    bookingId: string;
    bookedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};


export type RecentBooking = {
    id: string;
    bookedAt: string;
    user: { name: string; email: string };
    event: { id: string; title: string };
};

export type Stats = {
    totalBookings: number;
    upcomingEvents: number;
    seatFillRate: number;
    recentBookings: RecentBooking[];
};

export type FieldError = {
    field: string;
    message: string;
};

export type EventInput = {
    title: string;
    description: string;
    venue: string;
    startsAt: string;
    totalSeats: number;
};