import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  MONGODB_URI: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "events-api", timestamp: new Date().toISOString() });
});

// Events
app.get("/events", (c) => {
  return c.json({ message: "TODO: Implement list events" });
});

app.get("/events/:id", (c) => {
  return c.json({ message: "TODO: Implement get event by id" });
});

app.post("/events", (c) => {
  return c.json({ message: "TODO: Implement create event" });
});

app.get("/events/nearby", (c) => {
  return c.json({ message: "TODO: Implement nearby events" });
});

export default app;
