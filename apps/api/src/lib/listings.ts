import { db } from "@morsel/db";

export const expireStaleListings = () =>
  db.listing.updateMany({
    where: { status: "AVAILABLE", availableUntil: { lt: new Date() } },
    data: { status: "EXPIRED" },
  });

export const generatePickupCode = () =>
  crypto.getRandomValues(new Uint32Array(1))[0]!.toString().slice(-4).padStart(4, "0");
