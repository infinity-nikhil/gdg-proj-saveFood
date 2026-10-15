import type { BunRequest } from "bun";
import type { z } from "zod";
import { env } from "../env";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": env.webOrigin,
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: corsHeaders });

export const preflight = () => new Response(null, { status: 204, headers: corsHeaders });

type Handler<T extends string> = (req: BunRequest<T>) => Promise<Response> | Response;

export const handle =
  <T extends string>(handler: Handler<T>) =>
  async (req: BunRequest<T>) => {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof HttpError) {
        return json({ error: error.message, details: error.details }, error.status);
      }
      console.error(error);
      return json({ error: "Something went wrong on our side" }, 500);
    }
  };

export const parse = <S extends z.ZodType>(schema: S, input: unknown): z.infer<S> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    const fields = Object.fromEntries(
      result.error.issues.map((issue) => [issue.path.join("."), issue.message]),
    );
    throw new HttpError(422, result.error.issues[0]?.message ?? "Invalid input", fields);
  }
  return result.data;
};

export const readBody = async <S extends z.ZodType>(req: Request, schema: S) => {
  const body = await req.json().catch(() => {
    throw new HttpError(400, "Request body must be valid JSON");
  });
  return parse(schema, body);
};

export const searchParams = (req: Request) =>
  Object.fromEntries(
    [...new URL(req.url).searchParams.entries()].filter(([, value]) => value !== ""),
  );
