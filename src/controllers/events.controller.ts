import type { RequestHandler } from "express";

import * as eventsService from "../services/events.service.js";
import {
    eventIdParamSchema,
    listEventsQuerySchema,
} from "../schemas/event.schema.js";

export const listEvents: RequestHandler = async (req, res) => {
    const query = listEventsQuerySchema.parse(req.query);
    const result = await eventsService.listUpcomingEvents(query);

    res.status(200).json(result);
};

export const getEvent: RequestHandler = async (req, res) => {
    const { id } = eventIdParamSchema.parse(req.params);
    const event = await eventsService.getEvent(id);

    res.status(200).json({ event });
};