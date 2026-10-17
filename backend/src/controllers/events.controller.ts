import type { RequestHandler } from "express";

import * as eventsService from "../services/events.service.js";
import {
    eventIdParamSchema,
    listEventsQuerySchema,
    type EventInput
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

export const createEvent: RequestHandler = async (req, res) => {
    const event = await eventsService.createEvent(
        req.body as EventInput,
    );

    res.status(201).json({ event });
};

export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = eventIdParamSchema.parse(req.params);
    const event = await eventsService.updateEvent(
        id,
        req.body as EventInput,
    );

    res.status(200).json({ event });
};

export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = eventIdParamSchema.parse(req.params);

    await eventsService.deleteEvent(id);

    res.status(204).send();
};

export const listAttendees: RequestHandler = async (req, res) => {
    const { id } = eventIdParamSchema.parse(req.params);
    const result = await eventsService.listAttendees(id);

    res.status(200).json(result);
};

export const getStats: RequestHandler = async (_req, res) => {
    const stats = await eventsService.getStats();

    res.status(200).json({ stats });
};