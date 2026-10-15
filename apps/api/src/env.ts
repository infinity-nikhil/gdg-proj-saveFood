const required = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: new TextEncoder().encode(required("JWT_SECRET")),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
};
