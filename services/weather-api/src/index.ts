import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  MONGODB_URI: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  CACHE_STORAGE: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "weather-api", timestamp: new Date().toISOString() });
});

// Current weather
app.get("/current", (c) => {
  return c.json({ message: "TODO: Implement current weather" });
});

// Forecast
app.get("/forecast", (c) => {
  return c.json({ message: "TODO: Implement weather forecast" });
});

export default app;
