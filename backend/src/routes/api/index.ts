import { Router } from "express";
import users from "./users.js";
import phrases from "./phrases.js";

const router = Router();

router.use("/users", users);
router.use("/phrases", phrases);

export default router;
