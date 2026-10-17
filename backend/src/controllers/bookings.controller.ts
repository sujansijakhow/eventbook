import { HttpError } from "../lib/httpError.js";
import type { RequestHandler } from "express";

import * as bookingsService from "../services/bookings.service.js";
import {
    bookingIdParamSchema,
    type CreateBookingInput,
} from "../schemas/booking.schema.js";

export const createBooking: RequestHandler = async (req, res) => {
    if (req.user!.role === "admin") {
        throw new HttpError(403, "Admins cannot book seats");
    }

    const { eventId } = req.body as CreateBookingInput;
    const booking = await bookingsService.createBooking(
        req.user!.id,
        eventId,
    );

    res.status(201).json({ booking });
};

export const listMyBookings: RequestHandler = async (req, res) => {
    const result = await bookingsService.listUserBookings(
        req.user!.id,
    );

    res.status(200).json({ bookings: result });
};

export const cancelBooking: RequestHandler = async (req, res) => {
    const { id } = bookingIdParamSchema.parse(req.params);

    await bookingsService.cancelBooking(req.user!.id, id);

    res.status(204).send();
};