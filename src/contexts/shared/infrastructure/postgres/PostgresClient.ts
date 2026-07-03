import { Pool, PoolClient } from 'pg';
import { Service } from 'diod';

@Service()
export class PostgresClient {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
    });
  }

  async query<T>(queryText: string, values?: unknown[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(queryText, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getConnection(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async stop(): Promise<void> {
    await this.pool.end();
  }
}
