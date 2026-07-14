'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { Client } = require('pg');

require('dotenv').config();

const DATABASE_ROOT = path.resolve(__dirname, '..', '..', 'database');
const SQL_GROUPS = [
  ['migrations', 'migraciones'],
  ['views', 'vistas'],
  ['seeds', 'datos de demostración'],
];

async function sqlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

async function initialize() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Configura DATABASE_URL en backend/.env antes de inicializar PostgreSQL.');
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  await client.connect();
  try {
    const existing = await client.query("SELECT to_regclass('public.sucursales') AS table_name");
    if (existing.rows[0].table_name) {
      throw new Error('La base ya está inicializada. El script no sobrescribe datos existentes.');
    }

    await client.query('BEGIN');
    for (const [folder, label] of SQL_GROUPS) {
      console.log(`Aplicando ${label}...`);
      for (const file of await sqlFiles(path.join(DATABASE_ROOT, folder))) {
        console.log(`  ${path.basename(file)}`);
        await client.query(await fs.readFile(file, 'utf8'));
      }
    }
    await client.query('COMMIT');
    console.log('Base de datos SGTRA inicializada correctamente.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}

initialize().catch((error) => {
  console.error(`No fue posible inicializar PostgreSQL: ${error.message}`);
  process.exitCode = 1;
});
