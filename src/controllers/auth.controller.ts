import type { RequestHandler } from "express";

import * as authService from "../services/auth.service.js";
import type {
    LoginInput,
    RegisterInput,
} from "../schemas/auth.schema.js";

export const register: RequestHandler = async (
    req,
    res,
) => {
    const user = await authService.register(
        req.body as RegisterInput,
    );

    res.status(201).json({ user });
};

export const login: RequestHandler = async (req, res) => {
    const result = await authService.login(
        req.body as LoginInput,
    );

    res.status(200).json(result);
};