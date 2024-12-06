import pg from "pg";
import { config as dotenvConfig } from "dotenv";

const { Client } = pg;

async function createClient() {
  if (!process.env.POSTGRES_HOST) dotenvConfig(); // TODO refatorar

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production",
  });

  await client.connect();
  return client;
}

const client = createClient();

async function query(queryObject: string | { text: string; values: any[] }) {
  const connection = await client;
  return connection.query(queryObject);
}

export default {
  query,
  client,
};
