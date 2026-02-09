import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  MONGODB_URI: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  MINIAPP_ASSETS: R2Bucket;
  CONFIG_STORAGE: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "miniapp-registry", timestamp: new Date().toISOString() });
});

// Manifests
app.get("/manifests", (c) => {
  return c.json({ message: "TODO: Implement list mini-app manifests" });
});

app.get("/manifests/:id", (c) => {
  return c.json({ message: "TODO: Implement get mini-app manifest by id" });
});

// Assets
app.get("/assets/:appId/*", (c) => {
  return c.json({ message: "TODO: Implement serve mini-app assets from R2" });
});

export default app;
