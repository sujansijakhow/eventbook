import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next,
) => {
    console.error(err);

    const statusCode =
        typeof err?.statusCode === "number" &&
        err.statusCode >= 400 &&
        err.statusCode < 600
            ? err.statusCode
            : 500;

    const message =
        statusCode === 500
            ? "Internal server error"
            : err.message || "Request failed";

    res.status(statusCode).json({
        error: {
            message,
        },
    });
};