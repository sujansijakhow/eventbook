import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";

export const authenticate: RequestHandler = (
    req,
    _res,
    next,
) => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        throw new HttpError(401, "Authentication required");
    }

    let payload;

    try {
        payload = jwt.verify(header.slice(7), env.JWT_SECRET, {
            algorithms: ["HS256"],
        });
    } catch {
        throw new HttpError(401, "Invalid or expired token");
    }

    if (typeof payload === "string" || !payload.sub) {
        throw new HttpError(401, "Invalid or expired token");
    }

    req.user = {
        id: payload.sub,
        role: payload.role,
    };

    next();
};

export const requireAdmin: RequestHandler = (
    req,
    _res,
    next,
) => {
    if (req.user?.role !== "admin") {
        throw new HttpError(403, "Admin access required");
    }

    next();
};