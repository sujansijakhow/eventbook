import { z } from "zod";

export const listEventsQuerySchema = z.object({
    search: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(9),
});

export const eventIdParamSchema = z.object({
    id: z.uuid(),
});

const eventBodySchema = z.object({
    title: z.string().trim().min(2).max(150),
    description: z.string().trim().max(2000).default(""),
    venue: z.string().trim().min(2).max(150),
    startsAt: z.coerce.date(),
    totalSeats: z.number().int().min(1).max(10000),
});

export const createEventSchema = eventBodySchema.refine(
    (event) => event.startsAt > new Date(),
    {
        message: "startsAt must be in the future",
        path: ["startsAt"],
    },
);

export type ListEventsQuery = z.infer<
    typeof listEventsQuerySchema
>;

export const updateEventSchema = eventBodySchema;

export type EventInput = z.infer<
    typeof eventBodySchema
>;