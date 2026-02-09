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
  return c.json({ status: "ok", service: "pulse-api", timestamp: new Date().toISOString() });
});

// Feed
app.get("/feed", (c) => {
  return c.json({ message: "TODO: Implement short-form content feed" });
});

// Trending
app.get("/trending", (c) => {
  return c.json({ message: "TODO: Implement trending posts" });
});

// Posts
app.post("/posts", (c) => {
  return c.json({ message: "TODO: Implement create post" });
});

app.get("/posts/:id", (c) => {
  return c.json({ message: "TODO: Implement get post by id" });
});

export default app;
