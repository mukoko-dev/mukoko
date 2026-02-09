import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  MONGODB_URI: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  CHAT_ROOM: DurableObjectNamespace;
  USER_SESSION: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "connect-api", timestamp: new Date().toISOString() });
});

// Circles (communities)
app.get("/circles", (c) => {
  return c.json({ message: "TODO: Implement list circles" });
});

app.post("/circles", (c) => {
  return c.json({ message: "TODO: Implement create circle" });
});

app.get("/circles/:id", (c) => {
  return c.json({ message: "TODO: Implement get circle by id" });
});

app.get("/circles/:id/discussions", (c) => {
  return c.json({ message: "TODO: Implement circle discussions" });
});

// Durable Object stubs
export class ChatRoom implements DurableObject {
  constructor(private state: DurableObjectState, private env: Bindings) {}

  async fetch(request: Request): Promise<Response> {
    return new Response(JSON.stringify({ message: "TODO: Implement ChatRoom Durable Object" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export class UserSession implements DurableObject {
  constructor(private state: DurableObjectState, private env: Bindings) {}

  async fetch(request: Request): Promise<Response> {
    return new Response(JSON.stringify({ message: "TODO: Implement UserSession Durable Object" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default app;
