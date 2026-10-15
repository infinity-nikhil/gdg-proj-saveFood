import { db } from "@morsel/db";
import { loginSchema, registerSchema } from "@morsel/shared";
import { requireUser, signToken, toPublicUser } from "../lib/auth";
import { HttpError, handle, json, readBody } from "../lib/http";

export const authRoutes = {
  "/api/auth/register": {
    POST: handle(async (req) => {
      const input = await readBody(req, registerSchema);

      const existing = await db.user.findUnique({ where: { email: input.email } });
      if (existing) throw new HttpError(409, "An account with this email already exists");

      const { password, ...profile } = input;
      const user = await db.user.create({
        data: { ...profile, passwordHash: await Bun.password.hash(password) },
      });

      return json({ token: await signToken(user.id), user: toPublicUser(user) }, 201);
    }),
  },

  "/api/auth/login": {
    POST: handle(async (req) => {
      const { email, password } = await readBody(req, loginSchema);

      const user = await db.user.findUnique({ where: { email } });
      const valid = user && (await Bun.password.verify(password, user.passwordHash));
      if (!user || !valid) throw new HttpError(401, "Incorrect email or password");

      return json({ token: await signToken(user.id), user: toPublicUser(user) });
    }),
  },

  "/api/auth/me": {
    GET: handle(async (req) => {
      const user = await requireUser(req);
      return json({ user: toPublicUser(user) });
    }),
  },
};
