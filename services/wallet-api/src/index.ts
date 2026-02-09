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
  return c.json({ status: "ok", service: "wallet-api", timestamp: new Date().toISOString() });
});

// Balance
app.get("/balance", (c) => {
  return c.json({ message: "TODO: Implement get wallet balance" });
});

// Transactions
app.get("/transactions", (c) => {
  return c.json({ message: "TODO: Implement list transactions" });
});

// Pay
app.post("/pay", (c) => {
  return c.json({ message: "TODO: Implement payment" });
});

// Transfer
app.post("/transfer", (c) => {
  return c.json({ message: "TODO: Implement token transfer" });
});

export default app;
