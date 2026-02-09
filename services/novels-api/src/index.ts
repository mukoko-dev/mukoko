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
  return c.json({ status: "ok", service: "novels-api", timestamp: new Date().toISOString() });
});

// Novels
app.get("/novels", (c) => {
  return c.json({ message: "TODO: Implement list novels" });
});

app.get("/novels/:id", (c) => {
  return c.json({ message: "TODO: Implement get novel by id" });
});

// Chapters
app.get("/novels/:id/chapters", (c) => {
  return c.json({ message: "TODO: Implement list chapters for novel" });
});

app.get("/novels/:id/chapters/:num", (c) => {
  return c.json({ message: "TODO: Implement get chapter by number" });
});

export default app;
