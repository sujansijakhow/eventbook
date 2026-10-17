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

export type Stats = {
    totalBookings: number;
    upcomingEvents: number;
    seatFillRate: number;
};

export type FieldError = {
    field: string;
    message: string;
};

export type EventsSearchParams = { search?: string; page?: string };