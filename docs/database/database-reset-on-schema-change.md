# 🎯 Database reset on schema change

## 💡 Convention

Every time the database schema is modified (e.g., changes in `databases/init.sql` or new initialization scripts), the local database environment must be completely reset. This is done by removing the volumes to ensure a clean state.

The standard procedure is:
```bash
docker compose down -v
docker compose up -d
```

## 🏆 Benefits

- **Consistency**: Ensures the local database state matches the source code (schema definitions).
- **Reliability**: Prevents side effects from old data or partial schema updates that might cause tests or features to fail unexpectedly.
- **Reproducibility**: Guaranteed starting point for any development or testing task.

## 👀 Examples

### ✅ Good

After adding a new table or field in `databases/init.sql`:
1. Run `docker compose down -v` to wipe data and volumes.
2. Run `docker compose up -d` to recreate the database from the updated scripts.

### ❌ Bad

Modifying the SQL scripts and only restarting the container with `docker compose restart`. This will not apply schema changes if the database has already been initialized, as Postgres only runs scripts in `/docker-entrypoint-initdb.d/` when the data directory is empty.

## 🧐 Real world examples

- [Database initialization script](databases/init.sql)
- [Docker Compose configuration](compose.yml)

## 🔗 Related agreements

- [Postgres repositories](postgres-repositories.md)
- [Not null fields](not-null-fields.md)
