import type { Prisma } from "@morsel/db";
import type { Claim, Listing, Unit } from "@morsel/shared";

const party = { select: { id: true, name: true, organization: true } } as const;

export const listingInclude = {
  donor: party,
  claims: {
    where: { status: { not: "CANCELLED" } },
    orderBy: { createdAt: "desc" },
    take: 1,
    include: { receiver: party },
  },
} satisfies Prisma.ListingInclude;

export const claimInclude = {
  listing: { include: { donor: party } },
} satisfies Prisma.ClaimInclude;

type ListingRow = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;
type BaseListingRow = Prisma.ListingGetPayload<{ include: { donor: typeof party } }>;
type ClaimRow = Prisma.ClaimGetPayload<{ include: typeof claimInclude }>;

const toBaseListing = (row: BaseListingRow): Omit<Listing, "claim"> => ({
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  quantity: row.quantity,
  unit: row.unit as Unit,
  weightKg: row.weightKg,
  pickupAddress: row.pickupAddress,
  city: row.city,
  availableUntil: row.availableUntil.toISOString(),
  status: row.status,
  createdAt: row.createdAt.toISOString(),
  donor: row.donor,
});

export const toListing = (row: ListingRow): Listing => {
  const [claim] = row.claims;
  return {
    ...toBaseListing(row),
    claim: claim
      ? {
          id: claim.id,
          status: claim.status,
          createdAt: claim.createdAt.toISOString(),
          receiver: claim.receiver,
        }
      : null,
  };
};

export const toClaim = (row: ClaimRow): Claim => ({
  id: row.id,
  status: row.status,
  pickupCode: row.pickupCode,
  createdAt: row.createdAt.toISOString(),
  collectedAt: row.collectedAt?.toISOString() ?? null,
  listing: toBaseListing(row.listing),
});
