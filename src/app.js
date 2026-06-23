import express from "express";
import cors from "cors";
import { getConfig } from "./config.js";
import { createEventsService } from "./services/eventsService.js";
import { createEventsRouter } from "./routes/events.js";
import { errorHandler, notFound } from "./middlewares/errors.js";

export const createApp = ({
  config = getConfig(),
  eventsService = createEventsService(),
} = {}) => {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/events", createEventsRouter({ eventsService }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp();
