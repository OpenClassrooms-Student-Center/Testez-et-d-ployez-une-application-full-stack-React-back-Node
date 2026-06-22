export const DEFAULT_CORS_ORIGIN = "http://localhost:5173";

export const getConfig = (env = process.env) => ({
  port: Number(env.PORT) || 3001,
  corsOrigins: (env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
});
