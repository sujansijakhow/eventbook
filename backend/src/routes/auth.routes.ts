import { Router } from "express";

import {
    login,
    register,
    me
} from "../controllers/auth.controller.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
    loginSchema,
    registerSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", loginLimiter, validateBody(loginSchema), login);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", authenticate, me);

export default router;