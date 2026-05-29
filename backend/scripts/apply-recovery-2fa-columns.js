require('dotenv').config();

const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpSecret" TEXT');
  await client.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpEnabled" BOOLEAN NOT NULL DEFAULT false');
  await client.end();

  console.log('2FA recovery columns ready');
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
