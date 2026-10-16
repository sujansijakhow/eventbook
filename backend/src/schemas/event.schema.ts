import { z } from "zod";

export const listEventsQuerySchema = z.object({
    search: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(9),
});

export const eventIdParamSchema = z.object({
    id: z.uuid(),
});

export type ListEventsQuery = z.infer<
    typeof listEventsQuerySchema
>;