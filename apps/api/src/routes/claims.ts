import { db } from "@morsel/db";
import { requireUser } from "../lib/auth";
import { HttpError, handle, json } from "../lib/http";
import { claimInclude, toClaim } from "../lib/serializers";

export const claimRoutes = {
  "/api/claims/mine": {
    GET: handle(async (req) => {
      const receiver = await requireUser(req, "RECEIVER");

      const claims = await db.claim.findMany({
        where: { receiverId: receiver.id },
        include: claimInclude,
        orderBy: { createdAt: "desc" },
      });

      return json({ claims: claims.map(toClaim) });
    }),
  },

  "/api/claims/:id": {
    DELETE: handle<"/api/claims/:id">(async (req) => {
      const receiver = await requireUser(req, "RECEIVER");

      const claim = await db.claim.findUnique({
        where: { id: req.params.id },
        include: { listing: true },
      });
      if (!claim || claim.receiverId !== receiver.id) throw new HttpError(404, "Claim not found");
      if (claim.status !== "PENDING") throw new HttpError(409, "Only pending claims can be cancelled");

      const stillFresh = claim.listing.availableUntil > new Date();

      await db.$transaction([
        db.claim.update({ where: { id: claim.id }, data: { status: "CANCELLED" } }),
        db.listing.update({
          where: { id: claim.listingId },
          data: { status: stillFresh ? "AVAILABLE" : "EXPIRED" },
        }),
      ]);

      return json({ ok: true });
    }),
  },
};
