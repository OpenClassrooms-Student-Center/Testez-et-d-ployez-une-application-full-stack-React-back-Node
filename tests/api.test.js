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

});
