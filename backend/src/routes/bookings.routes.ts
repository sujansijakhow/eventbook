import { Router } from "express";

import {
    cancelBooking,
    createBooking,
    listMyBookings,
} from "../controllers/bookings.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createBookingSchema } from "../schemas/booking.schema.js";

const router = Router();

router.post(
    "/",
    authenticate,
    validateBody(createBookingSchema),
    createBooking,
);
router.get("/me", authenticate, listMyBookings);
router.delete("/:id", authenticate, cancelBooking);

export default router;