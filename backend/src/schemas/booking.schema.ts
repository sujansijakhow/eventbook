import { z } from "zod";

export const createBookingSchema = z.object({
    eventId: z.uuid(),
});

export type CreateBookingInput = z.infer<
    typeof createBookingSchema
>;