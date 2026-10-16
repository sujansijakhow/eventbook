import type { ErrorRequestHandler } from "express";

import { HttpError } from "../lib/httpError.js";

export const errorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
) => {
    if (error instanceof HttpError) {
        res.status(error.status).json({
            error: { message: error.message },
        });
        return;
    }

    if (error?.type === "entity.parse.failed") {
        res.status(400).json({
            error: { message: "Invalid JSON body" },
        });
        return;
    }

    console.error(error);

    res.status(500).json({
        error: { message: "Internal server error" },
    });
};