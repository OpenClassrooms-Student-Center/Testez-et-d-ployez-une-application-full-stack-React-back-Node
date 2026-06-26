import { Router } from "express";
import { HttpError } from "../middlewares/errors.js";
import { validateContact } from "../validators/contactValidator.js";

export const createContactRouter = ({ contactRepository }) => {
  const router = Router();

  router.post("/", (req, res) => {
    const result = validateContact(req.body);
    if (!result.valid) {
      throw new HttpError(
        400,
        "VALIDATION_ERROR",
        "Les données envoyées sont invalides",
        result.errors,
      );
    }
    const { id, receivedAt } = contactRepository.save(result.value);
    res.status(201).json({ id, receivedAt });
  });

  return router;
};
