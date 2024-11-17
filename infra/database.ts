import pg from "pg";
const { Client } = pg;

async function createClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV !== "development"
  });

  await client.connect();
  return client;
}

const clientPromise = createClient();

async function query(queryObject: string | { text: string; values: any[] }) {
  const client = await clientPromise;
  return client.query(queryObject);
}

export default { query };
