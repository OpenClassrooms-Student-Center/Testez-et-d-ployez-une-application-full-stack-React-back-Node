import { Router } from "express";
import { HttpError } from "../middlewares/errors.js";

export const createEventsRouter = ({ eventsService }) => {
  const router = Router();

  router.get("/", async (req, res) => {
    res.json(await eventsService.loadAll());
  });

  router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const event = Number.isInteger(id)
      ? await eventsService.findById(id)
      : null;
    if (!event) {
      throw new HttpError(404, "NOT_FOUND", "Événement introuvable");
    }
    res.json(event);
  });

  return router;
};
