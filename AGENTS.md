# Useful commands

```bash
npm prep          # lint + build + test
docker compose up # start database
npm run dev       # local dev server (not Docker)
npm run lint:fix
npm run test
```
# User guidelines

## Rules

- Write all code, comments, docs, commits, and tests in English
- Write all the texts in web UI in Spanish.
- Write self-documenting code, never add explanatory comments
- Never use mocks outside test files

## CLI

Instead of the following traditional commands, use faster alternatives:

- `tree` for structure
- `jq` for data

# Architecture

- Next.js 16, Onion Architecture, DDD.
- Frontend in `src/app/`, API routes in `src/app/api/`.
- Backend in `src/contexts/`.

# Documentation

- Detailed conventions with examples live in `docs/`.
- **Do NOT read all docs upfront.**
- When working on a task, use this map to find and read only the docs relevant to your task:

```
docs/
├── code-style.md
├── documentation-guidelines.md
├── backend/
│   ├── api-routes-reflect-metadata.md
│   ├── dependency-injection-diod.md
│   ├── hexagonal-architecture.md
│   └── thin-api-routes.md
├── database/
│   ├── not-null-fields.md
│   ├── postgres-repositories.md
│   ├── table-naming-singular-plural-convention.md
│   └── text-over-varchar-char-convention.md
└── testing/
    ├── mock-objects.md
    └── object-mothers.md
```
