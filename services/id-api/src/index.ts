import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  MONGODB_URI: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  USER_STORAGE: KVNamespace;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "id-api", timestamp: new Date().toISOString() });
});

// Authentication routes
app.post("/auth/login", (c) => {
  return c.json({ message: "TODO: Implement login via Stytch" });
});

app.post("/auth/register", (c) => {
  return c.json({ message: "TODO: Implement registration via Stytch" });
});

app.get("/auth/session", (c) => {
  return c.json({ message: "TODO: Implement session validation" });
});

app.get("/auth/user", (c) => {
  return c.json({ message: "TODO: Implement get current user" });
});

app.post("/auth/logout", (c) => {
  return c.json({ message: "TODO: Implement logout" });
});

export default app;
