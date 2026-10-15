import { db } from "@morsel/db";
import { collectSchema, createListingSchema, listingQuerySchema } from "@morsel/shared";
import { requireUser } from "../lib/auth";
import { HttpError, handle, json, parse, readBody, searchParams } from "../lib/http";
import { expireStaleListings, generatePickupCode } from "../lib/listings";
import { claimInclude, listingInclude, toClaim, toListing } from "../lib/serializers";

const findOwnedListing = async (id: string, donorId: string) => {
  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing) throw new HttpError(404, "Listing not found");
  if (listing.donorId !== donorId) throw new HttpError(403, "This listing belongs to someone else");
  return listing;
};

export const listingRoutes = {
  "/api/listings": {
    GET: handle(async (req) => {
      const { q, city, category } = parse(listingQuerySchema, searchParams(req));
      await expireStaleListings();

      const listings = await db.listing.findMany({
        where: {
          status: "AVAILABLE",
          category,
          city: city ? { equals: city, mode: "insensitive" } : undefined,
          OR: q
            ? [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ]
            : undefined,
        },
        include: listingInclude,
        orderBy: { availableUntil: "asc" },
      });

      return json({ listings: listings.map(toListing) });
    }),

    POST: handle(async (req) => {
      const donor = await requireUser(req, "DONOR");
      const input = await readBody(req, createListingSchema);

      const listing = await db.listing.create({
        data: { ...input, donorId: donor.id },
        include: listingInclude,
      });

      return json({ listing: toListing(listing) }, 201);
    }),
  },

  "/api/listings/mine": {
    GET: handle(async (req) => {
      const donor = await requireUser(req, "DONOR");
      await expireStaleListings();

      const listings = await db.listing.findMany({
        where: { donorId: donor.id },
        include: listingInclude,
        orderBy: { createdAt: "desc" },
      });

      return json({ listings: listings.map(toListing) });
    }),
  },

  "/api/listings/cities": {
    GET: handle(async () => {
      const rows = await db.listing.findMany({
        where: { status: "AVAILABLE", availableUntil: { gt: new Date() } },
        distinct: ["city"],
        select: { city: true },
        orderBy: { city: "asc" },
      });

      return json({ cities: rows.map((row) => row.city) });
    }),
  },

  "/api/listings/:id": {
    GET: handle<"/api/listings/:id">(async (req) => {
      const listing = await db.listing.findUnique({
        where: { id: req.params.id },
        include: listingInclude,
      });
      if (!listing) throw new HttpError(404, "Listing not found");

      return json({ listing: toListing(listing) });
    }),

    DELETE: handle<"/api/listings/:id">(async (req) => {
      const donor = await requireUser(req, "DONOR");
      const listing = await findOwnedListing(req.params.id, donor.id);
      if (listing.status === "RESERVED" || listing.status === "COLLECTED") {
        throw new HttpError(409, "Claimed listings can't be removed");
      }

      await db.listing.delete({ where: { id: listing.id } });
      return json({ ok: true });
    }),
  },

  "/api/listings/:id/claim": {
    POST: handle<"/api/listings/:id/claim">(async (req) => {
      const receiver = await requireUser(req, "RECEIVER");

      const claim = await db.$transaction(async (tx) => {
        const { count } = await tx.listing.updateMany({
          where: { id: req.params.id, status: "AVAILABLE", availableUntil: { gt: new Date() } },
          data: { status: "RESERVED" },
        });
        if (count === 0) throw new HttpError(409, "This food has already been claimed");

        return tx.claim.create({
          data: {
            listingId: req.params.id,
            receiverId: receiver.id,
            pickupCode: generatePickupCode(),
          },
          include: claimInclude,
        });
      });

      return json({ claim: toClaim(claim) }, 201);
    }),
  },

  "/api/listings/:id/collect": {
    POST: handle<"/api/listings/:id/collect">(async (req) => {
      const donor = await requireUser(req, "DONOR");
      const { code } = await readBody(req, collectSchema);
      const listing = await findOwnedListing(req.params.id, donor.id);

      const claim = await db.claim.findFirst({
        where: { listingId: listing.id, status: "PENDING" },
      });
      if (!claim) throw new HttpError(409, "Nobody has claimed this listing yet");
      if (claim.pickupCode !== code) throw new HttpError(422, "That pickup code doesn't match");

      const [, updated] = await db.$transaction([
        db.claim.update({
          where: { id: claim.id },
          data: { status: "COLLECTED", collectedAt: new Date() },
        }),
        db.listing.update({
          where: { id: listing.id },
          data: { status: "COLLECTED" },
          include: listingInclude,
        }),
      ]);

      return json({ listing: toListing(updated) });
    }),
  },
};
