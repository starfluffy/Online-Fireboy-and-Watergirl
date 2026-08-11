import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    scope: "api",
    route: "/api/health",
  });
});

export default router;