import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { pathToFileURL } from "url";
import routes from "./routes/routes.js";
import { initializeSocket } from "./socket/index.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "fireboy-watergirl-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/", routes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const httpServer = createServer(app);
initializeSocket(httpServer);

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  httpServer.listen(port, () => {
    console.log(`[Backend] Fireboy & Watergirl server listening on http://localhost:${port}`);
  });
}

export default app;