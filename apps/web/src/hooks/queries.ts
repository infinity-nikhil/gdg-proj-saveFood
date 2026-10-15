import type { Claim, CollectInput, CreateListingInput, Impact, Listing, ListingQuery } from "@morsel/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const keys = {
  listings: (filters: ListingQuery = {}) => ["listings", filters] as const,
  listing: (id: string) => ["listing", id] as const,
  myListings: ["listings", "mine"] as const,
  myClaims: ["claims", "mine"] as const,
  cities: ["cities"] as const,
  impact: ["impact"] as const,
  myImpact: ["impact", "me"] as const,
};

const toQueryString = (filters: ListingQuery) => {
  const params = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const useListings = (filters: ListingQuery) =>
  useQuery({
    queryKey: keys.listings(filters),
    queryFn: () => api.get<{ listings: Listing[] }>(`/listings${toQueryString(filters)}`),
    select: (data) => data.listings,
    placeholderData: (previous) => previous,
  });

export const useListing = (id: string) =>
  useQuery({
    queryKey: keys.listing(id),
    queryFn: () => api.get<{ listing: Listing }>(`/listings/${id}`),
    select: (data) => data.listing,
  });

export const useMyListings = () =>
  useQuery({
    queryKey: keys.myListings,
    queryFn: () => api.get<{ listings: Listing[] }>("/listings/mine"),
    select: (data) => data.listings,
  });

export const useMyClaims = () =>
  useQuery({
    queryKey: keys.myClaims,
    queryFn: () => api.get<{ claims: Claim[] }>("/claims/mine"),
    select: (data) => data.claims,
  });

export const useCities = () =>
  useQuery({
    queryKey: keys.cities,
    queryFn: () => api.get<{ cities: string[] }>("/listings/cities"),
    select: (data) => data.cities,
    staleTime: 5 * 60_000,
  });

export const useImpact = () =>
  useQuery({
    queryKey: keys.impact,
    queryFn: () => api.get<{ impact: Impact }>("/impact"),
    select: (data) => data.impact,
  });

export const useMyImpact = () =>
  useQuery({
    queryKey: keys.myImpact,
    queryFn: () => api.get<{ impact: Impact }>("/impact/me"),
    select: (data) => data.impact,
  });

const useInvalidateAll = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      ["listings", "listing", "claims", "impact", "cities"].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );
};

export const useCreateListing = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (input: CreateListingInput) => api.post<{ listing: Listing }>("/listings", input),
    onSuccess: invalidate,
  });
};

export const useDeleteListing = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/listings/${id}`),
    onSuccess: invalidate,
  });
};

export const useClaimListing = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => api.post<{ claim: Claim }>(`/listings/${id}/claim`),
    onSuccess: invalidate,
  });
};

export const useCollectListing = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, ...input }: CollectInput & { id: string }) =>
      api.post<{ listing: Listing }>(`/listings/${id}/collect`, input),
    onSuccess: invalidate,
  });
};

export const useCancelClaim = () => {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/claims/${id}`),
    onSuccess: invalidate,
  });
};
