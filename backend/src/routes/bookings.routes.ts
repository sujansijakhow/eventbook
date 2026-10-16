import { Router } from "express";

import { createBooking } from "../controllers/bookings.controller.js";
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

export default router;