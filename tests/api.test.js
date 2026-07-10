import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("API 724events", () => {
  const app = createApp({ config: { corsOrigins: ["http://localhost:5173"] } });

  describe("GET /api/health", () => {
    it("répond que le serveur fonctionne", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("GET /api/events", () => {
    it("renvoie les événements et le carrousel au format JSON", async () => {
      const response = await request(app).get("/api/events");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(Object.keys(response.body).sort()).toEqual(["events", "focus"]);
    });
  });

  describe("GET /api/events/:id", () => {
    it.todo("renvoie l'événement demandé");
    it.todo("renvoie 404 pour un identifiant inconnu ou invalide");
  });

  describe("POST /api/contact", () => {
    it.todo("enregistre une demande valide et renvoie 201");
    it.todo("refuse une demande invalide et détaille les erreurs");
    it.todo("refuse un corps qui n'est pas du JSON valide");
  });

  describe("en cas d'erreur", () => {
    it.todo("renvoie 404 au format JSON pour une route inconnue");
    it.todo("renvoie 500 sans détail technique si le service échoue");
  });
});
