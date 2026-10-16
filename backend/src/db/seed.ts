import bcrypt from "bcryptjs";
import { inArray } from "drizzle-orm";

import { db } from "./db.js";
import { bookings, events, users } from "./schema.js";

const DAY = 24 * 60 * 60 * 1000;

const ADMIN_PASSWORD = "Admin123";
const USER_PASSWORD = "User123";

const topics = [
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "Docker",
    "UI Design",
    "Next.js",
    "Python",
    "Git",
    "Testing",
    "Cloud",
];
const kinds = ["Workshop", "Meetup"];
const venues = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];
const seatOptions = [20, 30, 50, 100];

async function seed() {
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const userHash = await bcrypt.hash(USER_PASSWORD, 12);

    const accounts = [
        {
            name: "Admin",
            email: "admin@example.com",
            role: "admin" as const,
            passwordHash: adminHash,
        },
        {
            name: "Test User",
            email: "user@example.com",
            role: "user" as const,
            passwordHash: userHash,
        },
        ...[1, 2, 3, 4].map((n) => ({
            name: `Attendee ${n}`,
            email: `attendee${n}@example.com`,
            role: "user" as const,
            passwordHash: userHash,
        })),
    ];

    // reset: bookings first, because events and users are
    // referenced by them
    await db.delete(bookings);
    await db.delete(events);
    await db
        .delete(users)
        .where(
            inArray(
                users.email,
                accounts.map((account) => account.email),
            ),
        );

    const createdUsers = await db
        .insert(users)
        .values(accounts)
        .returning({ id: users.id, email: users.email });

    const userIds = Object.fromEntries(
        createdUsers.map((user) => [user.email, user.id]),
    );

    const regularEvents = topics.flatMap((topic, t) =>
        kinds.map((kind, k) => {
            const i = t * kinds.length + k;

            return {
                title: `${topic} ${kind}`,
                description: `${kind} on ${topic} for developers and students.`,
                venue: venues[i % venues.length],
                startsAt: new Date(Date.now() + (i + 2) * DAY),
                totalSeats: seatOptions[i % seatOptions.length],
            };
        }),
    );

    const specialEvents = [
        {
            title: "Photography Walk",
            description: "Nearly full: only one seat left.",
            venue: "Patan",
            startsAt: new Date(Date.now() + 5 * DAY),
            totalSeats: 5,
        },
        {
            title: "Sold Out Hackathon",
            description: "Fully booked.",
            venue: "Kathmandu",
            startsAt: new Date(Date.now() + 6 * DAY),
            totalSeats: 2,
        },
        {
            title: "Old Concert",
            description: "This event already happened.",
            venue: "Bhaktapur",
            startsAt: new Date(Date.now() - 3 * DAY),
            totalSeats: 100,
        },
    ];

    const createdEvents = await db
        .insert(events)
        .values([...regularEvents, ...specialEvents])
        .returning({ id: events.id, title: events.title });

    const eventIds = Object.fromEntries(
        createdEvents.map((event) => [event.title, event.id]),
    );

    const book = (title: string, emails: string[]) =>
        emails.map((email) => ({
            userId: userIds[email],
            eventId: eventIds[title],
        }));

    await db.insert(bookings).values([
        ...book("Photography Walk", [
            "attendee1@example.com",
            "attendee2@example.com",
            "attendee3@example.com",
            "attendee4@example.com",
        ]),
        ...book("Sold Out Hackathon", [
            "attendee1@example.com",
            "attendee2@example.com",
        ]),
        ...book("Old Concert", ["user@example.com"]),
        ...book("React Workshop", ["user@example.com"]),
    ]);

    console.log(
        `Seeded ${createdEvents.length} events and ${createdUsers.length} users.`,
    );
    console.log(`Admin: admin@example.com / ${ADMIN_PASSWORD}`);
    console.log(`User:  user@example.com / ${USER_PASSWORD}`);
}

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });