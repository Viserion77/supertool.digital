import { exec } from "node:child_process";

function checkPostgres() {
  function handleReturn(
    error: import("child_process").ExecException | null,
    stdout: string,
    stderr: string,
  ): void {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.info("\n🟢 Postgres is ready");
  }

  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
}

process.stdout.write("🔴 Waiting for Postgres to be ready");
checkPostgres();
