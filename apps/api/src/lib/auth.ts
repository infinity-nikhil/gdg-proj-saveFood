import { db, type User } from "@morsel/db";
import type { PublicUser, Role } from "@morsel/shared";
import { SignJWT, jwtVerify } from "jose";
import { env } from "../env";
import { HttpError } from "./http";

export const signToken = (userId: string) =>
  new SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(env.jwtSecret);

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  organization: user.organization,
  city: user.city,
});

export const requireUser = async (req: Request, role?: Role) => {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) throw new HttpError(401, "Please sign in to continue");

  const userId = await jwtVerify(token, env.jwtSecret)
    .then(({ payload }) => payload.sub)
    .catch(() => undefined);
  if (!userId) throw new HttpError(401, "Your session has expired");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(401, "Account not found");
  if (role && user.role !== role) {
    throw new HttpError(403, `Only ${role.toLowerCase()}s can do this`);
  }

  return user;
};
