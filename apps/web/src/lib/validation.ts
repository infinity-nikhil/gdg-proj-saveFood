import type { z } from "zod";
import { ApiError } from "./api";

export type FieldErrors = Record<string, string>;

export const validate = <S extends z.ZodType>(schema: S, values: unknown) => {
  const result = schema.safeParse(values);
  if (result.success) return { data: result.data as z.infer<S>, errors: {} as FieldErrors };

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    errors[key] ??= issue.message;
  }
  return { data: null, errors };
};

export const fieldErrorsFrom = (error: unknown): FieldErrors =>
  error instanceof ApiError ? error.fields : {};
