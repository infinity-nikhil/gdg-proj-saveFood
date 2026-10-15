import { z } from "zod";
import { CATEGORIES, ROLES, UNITS } from "./constants";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.email("Enter a valid email").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Use at least 8 characters").max(128),
  role: z.enum(ROLES),
  organization: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2, "City is required").max(80),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export const createListingSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(100),
  description: z.string().trim().max(600).default(""),
  category: z.enum(CATEGORIES),
  quantity: z.coerce.number().int().positive("Quantity must be above zero"),
  unit: z.enum(UNITS),
  weightKg: z.coerce.number().positive("Weight must be above zero").max(5000),
  pickupAddress: z.string().trim().min(5, "Add a pickup address").max(200),
  city: z.string().trim().min(2, "City is required").max(80),
  availableUntil: z.coerce
    .date()
    .refine((date) => date.getTime() > Date.now(), "Pickup window must be in the future"),
});

export const listingQuerySchema = z.object({
  q: z.string().trim().optional(),
  city: z.string().trim().optional(),
  category: z.enum(CATEGORIES).optional(),
});

export type RegisterInput = z.input<typeof registerSchema>;
export type LoginInput = z.input<typeof loginSchema>;
export type CreateListingInput = z.input<typeof createListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;

export const collectSchema = z.object({
  code: z.string().trim().length(4, "Pickup codes have 4 digits"),
});

export type CollectInput = z.input<typeof collectSchema>;
