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
  return c.json({ status: "ok", service: "gateway", timestamp: new Date().toISOString() });
});

// Clips route group
app.all("/clips/*", (c) => {
  return c.json({ message: "TODO: Implement clips proxy" });
});

// Events route group
app.all("/events/*", (c) => {
  return c.json({ message: "TODO: Implement events proxy" });
});

// Pulse route group
app.all("/pulse/*", (c) => {
  return c.json({ message: "TODO: Implement pulse proxy" });
});

// Connect route group
app.all("/connect/*", (c) => {
  return c.json({ message: "TODO: Implement connect proxy" });
});

// Novels route group
app.all("/novels/*", (c) => {
  return c.json({ message: "TODO: Implement novels proxy" });
});

// Weather route group
app.all("/weather/*", (c) => {
  return c.json({ message: "TODO: Implement weather proxy" });
});

// Wallet route group
app.all("/wallet/*", (c) => {
  return c.json({ message: "TODO: Implement wallet proxy" });
});

// Shamwari route group
app.all("/shamwari/*", (c) => {
  return c.json({ message: "TODO: Implement shamwari proxy" });
});

// Mini-app registry route group
app.all("/miniapps/*", (c) => {
  return c.json({ message: "TODO: Implement miniapp-registry proxy" });
});

// Digital twin route group
app.all("/twin/*", (c) => {
  return c.json({ message: "TODO: Implement digital-twin proxy" });
});

// Auth route group
app.all("/auth/*", (c) => {
  return c.json({ message: "TODO: Implement auth proxy" });
});

export default app;
