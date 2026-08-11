import { Router } from "express";
import users from "../../db/user-schema.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(users);
});

router.get("/:id", (req, res) => {
  const user = users.find((entry) => entry._id === req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
});

export default router;