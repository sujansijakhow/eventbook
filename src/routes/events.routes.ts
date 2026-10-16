import { Router } from "express";

import {
    getEvent,
    listEvents,
} from "../controllers/events.controller.js";

const router = Router();

router.get("/", listEvents);
router.get("/:id", getEvent);

export default router;