# Morsel

Zero food waste platform that connects restaurants, bakeries and grocers with shelters, community fridges and people nearby.

## Stack

- Turborepo + Bun workspaces
- `apps/api` — Bun + TypeScript
- `apps/web` — React + TypeScript + Vite + Tailwind
- `packages/db` — Prisma ORM on PostgreSQL (Docker)
- `packages/shared` — Zod schemas and types shared by API and web

## Getting started

```bash
bun install
cp .env.example .env
bun run setup
bun run dev
```

- Web: http://localhost:5173
- API: http://localhost:3001

## Demo accounts

Password for all: `password123`

| Role     | Email                    |
| -------- | ------------------------ |
| Donor    | ana@crumbandco.com       |
| Donor    | rohit@tamarindbistro.com |
| Receiver | kabir@hopekitchen.org    |
| Receiver | sara@communityfridge.org |

## How it works

1. A donor lists surplus food with quantity, pickup address and a pickup deadline.
2. A receiver claims it and gets a private 4-digit pickup code.
3. At handover the donor enters the code to confirm the pickup, and it counts toward impact stats (kg rescued, meals, CO₂e, water).

## Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `bun run dev`        | Run API and web together            |
| `bun run build`      | Build all apps                      |
| `bun run typecheck`  | Typecheck every package             |
| `bun run db:up`      | Start Postgres in Docker            |
| `bun run db:push`    | Sync the Prisma schema to the DB    |
| `bun run db:seed`    | Load demo data                      |
| `bun run db:studio`  | Open Prisma Studio                  |
