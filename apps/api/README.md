# SalesOps API

Backend for SalesOps (Commerce Control Plane). Built with **Hono**, **Prisma**, and **SQLite**.

## Architecture

- **Controller** → HTTP request/response only.
- **Service** → Business logic; no framework types.
- **Repository** → Data access only (Prisma); no SQL scattered elsewhere.

```
src/
├── modules/
│   ├── health/           # Health check
│   ├── user/             # Example CRUD (controller, service, repository, dto)
├── common/
│   ├── filters/          # Error handling
│   ├── interceptors/     # Logging
│   ├── guards/           # Auth (e.g. JWT)
├── config/               # Env and app config
├── lib/                  # Prisma client
└── main.ts
```

## Setup

1. Copy env and install deps:

   ```bash
   cp .env.example .env
   npm install
   ```

2. Generate Prisma client and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

3. Start dev server:

   ```bash
   npm run dev
   ```

API base: `http://localhost:3000/api`

## Scripts

| Script              | Description                    |
|---------------------|--------------------------------|
| `npm run dev`       | Start with tsx watch           |
| `npm run build`     | Compile to `dist/`             |
| `npm run start`     | Run `dist/main.js`             |
| `npm run db:generate` | Generate Prisma client       |
| `npm run db:migrate`  | Run migrations (dev)         |
| `npm run db:migrate:deploy` | Deploy migrations (prod) |
| `npm run db:studio`  | Open Prisma Studio            |
| `npm run test`       | Run tests                     |

## API contract

- **OpenAPI**: `GET /api/openapi.json`
- **REST**: `GET/POST /api/users`, `GET/PATCH/DELETE /api/users/:id`, `GET /api/health`

## Security & quality

- Input validation via **Zod** and `@hono/zod-validator`.
- Central error handler; internal details masked in production.
- Config via `.env`; secrets not committed (see `.env.example`).
- Migrations required; no ad‑hoc schema changes.
- ESLint and tests in place; extend with rate limiting, JWT, RBAC as needed.
