import { Router } from "express";

import {
    createEvent,
    deleteEvent,
    getEvent,
    listEvents,
    updateEvent,
} from "../controllers/events.controller.js";
import {
    authenticate,
    requireAdmin,
} from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
    createEventSchema,
    updateEventSchema,
} from "../schemas/event.schema.js";

const router = Router();

router.get("/", listEvents);
router.get("/:id", getEvent);

router.post(
    "/",
    authenticate,
    requireAdmin,
    validateBody(createEventSchema),
    createEvent,
);
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validateBody(updateEventSchema),
    updateEvent,
);
router.delete("/:id", authenticate, requireAdmin, deleteEvent);

export default router;