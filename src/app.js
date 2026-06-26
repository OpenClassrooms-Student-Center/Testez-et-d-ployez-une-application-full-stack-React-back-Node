import express from "express";
import cors from "cors";
import { getConfig } from "./config.js";
import { createEventsService } from "./services/eventsService.js";
import { createContactRepository } from "./repositories/contactRepository.js";
import { createEventsRouter } from "./routes/events.js";
import { createContactRouter } from "./routes/contact.js";
import { errorHandler, notFound } from "./middlewares/errors.js";

export const createApp = ({
  config = getConfig(),
  eventsService = createEventsService(),
  contactRepository = createContactRepository(),
} = {}) => {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/events", createEventsRouter({ eventsService }));
  app.use("/api/contact", createContactRouter({ contactRepository }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp();
