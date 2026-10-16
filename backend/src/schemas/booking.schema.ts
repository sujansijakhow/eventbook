import { z } from "zod";

export const createBookingSchema = z.object({
    eventId: z.uuid(),
});

export const bookingIdParamSchema = z.object({
    id: z.uuid(),
});

export type CreateBookingInput = z.infer<
    typeof createBookingSchema
>;