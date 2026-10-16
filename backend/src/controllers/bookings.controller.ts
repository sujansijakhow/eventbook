import type { RequestHandler } from "express";

import * as bookingsService from "../services/bookings.service.js";
import type { CreateBookingInput } from "../schemas/booking.schema.js";

export const createBooking: RequestHandler = async (req, res) => {
    const { eventId } = req.body as CreateBookingInput;
    const booking = await bookingsService.createBooking(
        req.user!.id,
        eventId,
    );

    res.status(201).json({ booking });
};