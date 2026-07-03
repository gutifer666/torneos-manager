# 🎯 Postgres Repositories

## 💡 Convention

We use `PostgresClient` as a centralized service to interact with the PostgreSQL database. Infrastructure repositories must:
1. Extend the abstract class (or interface) of the repository defined in the domain.
2. Be decorated with `@Service()` for injection.
3. Inject `PostgresClient` in the constructor.
4. Implement the `save` method using the **upsert** pattern (`INSERT ... ON CONFLICT (id) DO UPDATE SET ...`) to ensure the operation is idempotent.
5. Use parameterized queries (`$1`, `$2`, etc.) to prevent SQL injection risks.

Tables must be initialized or modified using SQL scripts in the `databases/` folder.

## 🏆 Benefits

- **Decoupling**: The domain does not know the details of PostgreSQL.
- **Idempotency**: Using `ON CONFLICT` allows retrying operations without duplicating data.
- **Security**: Parameterized queries protect against SQL injection attacks.
- **Maintainability**: Centralizes connection and pool management in `PostgresClient`.

## 👀 Examples

### ✅ Good: Correct implementation of a Postgres Repository

```typescript
@Service()
export class PostgresPlayerRepository extends PlayerRepository {
  constructor(private readonly client: PostgresClient) {
    super();
  }

  async save(player: Player): Promise<void> {
    const primitives = player.toPrimitives();
    const query = {
      text: `INSERT INTO players (id, name, surname, birth_date, dorsal, file_number)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO UPDATE SET
               name = EXCLUDED.name,
               surname = EXCLUDED.surname,
               birth_date = EXCLUDED.birth_date,
               dorsal = EXCLUDED.dorsal,
               file_number = EXCLUDED.file_number`,
      values: [
        primitives.id,
        primitives.name,
        primitives.surname,
        primitives.birthDate,
        primitives.dorsal,
        primitives.fileNumber,
      ],
    };

    await this.client.query(query.text, query.values);
  }
}
```

### ❌ Bad: Manual connection management or raw string concatenation

```typescript
export class BadRepository {
  async save(player: any) {
    const client = new Client(); // ❌ Don't manage connections manually
    await client.connect();
    // ❌ SQL Injection risk and no ON CONFLICT
    await client.query(`INSERT INTO players (name) VALUES ('${player.name}')`); 
  }
}
```

## 🧐 Real world examples

- `src/contexts/shared/infrastructure/postgres/PostgresClient.ts`: Base client for PostgreSQL.
- `src/contexts/players/player/infrastructure/PostgresPlayerRepository.ts`: Example of a players repository.
- `src/contexts/shared/infrastructure/dependency-injection/diod.config.ts`: Service registration in the DI container.
- `databases/init.sql`: Initial schema definition.

## 🔗 Related agreements

- [Hexagonal Architecture](../backend/hexagonal-architecture.md)
- [Dependency Injection with DIOD](../backend/dependency-injection-diod.md)
- [Table naming convention](table-naming-singular-plural-convention.md)
