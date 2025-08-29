import pg from "pg";
import { config as dotenvConfig } from "dotenv";

const { Client } = pg;

let clientPromise: Promise<pg.Client | null> | null = null;

async function ensureClient(): Promise<pg.Client | null> {
  if (clientPromise) return clientPromise;
  if (!process.env.POSTGRES_HOST && !process.env.DATABASE_URL) dotenvConfig();

  const hasConfig = !!(process.env.POSTGRES_HOST || process.env.DATABASE_URL);
  if (!hasConfig) {
    clientPromise = Promise.resolve(null);
    return clientPromise;
  }

  const sslMode = (process.env.PGSSLMODE || "").toLowerCase();
  const sslRequired =
    sslMode === "require" ||
    process.env.POSTGRES_SSL === "true" ||
    (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("sslmode=require"));

  clientPromise = (async () => {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    return client;
  })();

  return clientPromise;
}

async function query(queryObject: string | { text: string; values: string[] }) {
  const connection = await ensureClient();
  if (!connection) throw new Error("DATABASE_NOT_CONFIGURED");
  return connection.query(queryObject as any);
}

export default {
  query,
  client: ensureClient(),
};
