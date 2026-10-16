import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

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

    if (error instanceof ZodError) {
        res.status(400).json({
            error: {
                message: "Validation failed",
                details: error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            },
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