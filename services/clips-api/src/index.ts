import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  MONGODB_URI: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  NEWS_STORAGE: KVNamespace;
  CACHE_STORAGE: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "clips-api", timestamp: new Date().toISOString() });
});

// Articles
app.get("/articles", (c) => {
  return c.json({ message: "TODO: Implement list articles" });
});

app.get("/articles/:id", (c) => {
  return c.json({ message: "TODO: Implement get article by id" });
});

// Categories
app.get("/categories", (c) => {
  return c.json({ message: "TODO: Implement list categories" });
});

// Sources
app.get("/sources", (c) => {
  return c.json({ message: "TODO: Implement list sources" });
});

// Trending
app.get("/trending", (c) => {
  return c.json({ message: "TODO: Implement trending articles" });
});

export default app;
