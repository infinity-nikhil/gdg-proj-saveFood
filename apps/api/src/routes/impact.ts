import { db, type Prisma } from "@morsel/db";
import { CO2_PER_KG, KG_PER_MEAL, WATER_LITRES_PER_KG, type Impact } from "@morsel/shared";
import { requireUser } from "../lib/auth";
import { handle, json } from "../lib/http";

const round = (value: number) => Math.round(value * 10) / 10;

const measure = async (scope: Prisma.ListingWhereInput = {}): Promise<Impact> => {
  const [collected, activeListings] = await Promise.all([
    db.listing.aggregate({
      where: { ...scope, status: "COLLECTED" },
      _sum: { weightKg: true },
      _count: true,
    }),
    db.listing.count({
      where: { ...scope, status: "AVAILABLE", availableUntil: { gt: new Date() } },
    }),
  ]);

  const kgSaved = collected._sum.weightKg ?? 0;

  return {
    kgSaved: round(kgSaved),
    meals: Math.round(kgSaved / KG_PER_MEAL),
    co2Kg: round(kgSaved * CO2_PER_KG),
    waterLitres: Math.round(kgSaved * WATER_LITRES_PER_KG),
    rescues: collected._count,
    activeListings,
  };
};

export const impactRoutes = {
  "/api/impact": {
    GET: handle(async () => json({ impact: await measure() })),
  },

  "/api/impact/me": {
    GET: handle(async (req) => {
      const user = await requireUser(req);
      const scope: Prisma.ListingWhereInput =
        user.role === "DONOR"
          ? { donorId: user.id }
          : { claims: { some: { receiverId: user.id, status: "COLLECTED" } } };

      return json({ impact: await measure(scope) });
    }),
  },
};
