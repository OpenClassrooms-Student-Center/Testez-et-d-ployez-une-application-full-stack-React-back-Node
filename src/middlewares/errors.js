export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (req, res, next) => {
  next(new HttpError(404, "NOT_FOUND", "Ressource introuvable"));
};

// eslint-disable-next-line no-unused-vars -- Express reconnaît un gestionnaire d'erreurs à ses 4 paramètres
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    const body = { error: err.code, message: err.message };
    if (err.details) body.details = err.details;
    return res.status(err.status).json(body);
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "PAYLOAD_TOO_LARGE",
      message: "Le corps de la requête dépasse 10 Ko",
    });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "INVALID_JSON",
      message: "Le corps de la requête n'est pas un JSON valide",
    });
  }
  console.error(err);
  return res
    .status(500)
    .json({ error: "INTERNAL_ERROR", message: "Erreur interne du serveur" });
};
