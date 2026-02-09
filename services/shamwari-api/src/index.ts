import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  MONGODB_URI: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "shamwari-api", timestamp: new Date().toISOString() });
});

// Ask AI
app.post("/ask", (c) => {
  return c.json({ message: "TODO: Implement AI question answering" });
});

// Summarize
app.post("/summarize", (c) => {
  return c.json({ message: "TODO: Implement AI summarization" });
});

// Translate
app.post("/translate", (c) => {
  return c.json({ message: "TODO: Implement AI translation" });
});

export default app;
