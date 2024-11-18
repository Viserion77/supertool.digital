import database from "~/resources/database";

export default defineEventHandler(async (event) => {
  const now = new Date().toISOString();

  const serverVersionResult = await database.query("SHOW server_version");
  const databaseVersion = serverVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections");
  const maxConnections = maxConnectionsResult.rows[0].max_connections;

  const currentConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DATABASE],
  });
  const currentConnections = currentConnectionsResult.rows[0].count;

  return {
    updated_at: now,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: currentConnections,
      },
    },
  };
});
