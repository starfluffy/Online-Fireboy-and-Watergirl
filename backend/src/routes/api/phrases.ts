import { Router } from "express";
import phrases from "../../db/phrase-schema.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(phrases);
});

router.get("/:id", (req, res) => {
  const phrase = phrases.find((entry) => entry._id === req.params.id);
  if (!phrase) {
    res.status(404).json({ message: "Phrase not found" });
    return;
  }

  res.json(phrase);
});

export default router;