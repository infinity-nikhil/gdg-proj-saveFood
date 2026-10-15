import type { CATEGORIES, CLAIM_STATUSES, LISTING_STATUSES, ROLES, UNITS } from "./constants";

export type Role = (typeof ROLES)[number];
export type Category = (typeof CATEGORIES)[number];
export type ListingStatus = (typeof LISTING_STATUSES)[number];
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];
export type Unit = (typeof UNITS)[number];

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string | null;
  city: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  quantity: number;
  unit: Unit;
  weightKg: number;
  pickupAddress: string;
  city: string;
  availableUntil: string;
  status: ListingStatus;
  createdAt: string;
  donor: Pick<PublicUser, "id" | "name" | "organization">;
  claim: ClaimSummary | null;
}

export interface ClaimSummary {
  id: string;
  status: ClaimStatus;
  createdAt: string;
  receiver: Pick<PublicUser, "id" | "name" | "organization">;
}

export interface Claim {
  id: string;
  status: ClaimStatus;
  pickupCode: string;
  createdAt: string;
  collectedAt: string | null;
  listing: Omit<Listing, "claim">;
}

export interface Impact {
  kgSaved: number;
  meals: number;
  co2Kg: number;
  waterLitres: number;
  rescues: number;
  activeListings: number;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}
