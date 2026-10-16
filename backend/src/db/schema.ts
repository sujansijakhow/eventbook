
import {
    pgTable,
    pgEnum,
    uuid,
    text,
    integer,
    timestamp,
    uniqueIndex,
    index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("user"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    venue: text("venue").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    totalSeats: integer("total_seats").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

export const bookings = pgTable(
    "bookings",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        eventId: uuid("event_id")
            .notNull()
            .references(() => events.id, { onDelete: "restrict" }),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        uniqueIndex("bookings_user_event_unique").on(t.userId, t.eventId),
        index("bookings_event_idx").on(t.eventId),
    ],
);
