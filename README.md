# SalesOps

Commerce Control Plane (營運/後台) — monorepo with frontend and backend.

## Structure

```
SalesOps/
├── apps/
│   ├── web/     # Frontend (Vite + React + TypeScript)
│   └── api/     # Backend (Hono + Prisma + SQLite)
├── .github/     # CI (branch name, commitlint, etc.)
├── .husky/      # Git hooks (pre-commit, pre-push, commit-msg)
└── package.json # Workspace root
```

## Quick start

```bash
# Install dependencies (root + all workspaces)
npm install

# Run frontend (dev)
npm run dev
# or
npm run dev:web

# Run backend (dev) — in another terminal
npm run dev:api
```

- **Web**: http://localhost:5173 (or Vite’s port)
- **API**: http://localhost:3000/api

## Scripts (root)

| Script        | Description                    |
|---------------|--------------------------------|
| `npm run dev` | Start web app (default)        |
| `npm run dev:web` | Start web dev server       |
| `npm run dev:api` | Start API dev server       |
| `npm run build`   | Build all apps             |
| `npm run lint`    | Lint all apps              |
| `npm run test`    | Test all apps              |

See `apps/web` and `apps/api` for app-specific scripts (e.g. `db:migrate`, `db:studio`).

## Commit message conventions

We use **Conventional Commits** and enforce rules via **commitlint**.

- **Format**: `type(scope): description`
- **Scope**: must reflect the module (e.g. ui, api, auth)
- **Description**: start with a verb; keep it short and clear

### Commit message prompt (copy/paste)

```text
Based on the current git diff, generate a commit message that follows these rules:

- Format: type(scope): description
- Type must be one of: feat, fix, refactor, perf, style, test, docs, chore, build, ci
- Scope must be one of: ui, layout, page, component, hook, api, state, router, auth, permission, i18n, theme, devops
- Description must start with a verb; keep it short and clear
- Output only a single-line commit message (no code block, no quotes, no extra text)
```

## Demo / deployment

- **Frontend**: Deploy `apps/web` (e.g. Vercel/Netlify). For demos with live data, point `VITE_API_URL` to your deployed API or ngrok URL.
- **Backend**: Deploy `apps/api` to a long-lived host (e.g. Railway, Render) when you need a public API for the shared frontend link.
