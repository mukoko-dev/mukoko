import { createMiddleware } from "hono/factory";

type AuthBindings = {
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
};

export const requireAuth = createMiddleware<{ Bindings: AuthBindings }>(async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing session token" } }, 401);
  }
  // TODO: Verify Stytch session token
  // const stytch = new stytch.Client({ project_id: c.env.STYTCH_PROJECT_ID, secret: c.env.STYTCH_SECRET });
  // const session = await stytch.sessions.authenticate({ session_token: token });
  await next();
});
