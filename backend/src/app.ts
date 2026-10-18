import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.routes.js";
import eventsRouter from "./routes/events.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";

export const app = express();
app.set("trust proxy", 1);

app.use(
    cors({
        origin: env.CORS_ORIGIN,
    }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
    });
});


app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/bookings", bookingsRouter);

app.use(errorHandler);