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
  return c.json({ status: "ok", service: "digital-twin", timestamp: new Date().toISOString() });
});

// Digital Twin
app.get("/twin/:userId", (c) => {
  return c.json({ message: "TODO: Implement get digital twin for user" });
});

app.post("/twin/mint", (c) => {
  return c.json({ message: "TODO: Implement mint NFT for digital twin" });
});

// Reputation
app.get("/reputation/:userId", (c) => {
  return c.json({ message: "TODO: Implement get user reputation score" });
});

export default app;
