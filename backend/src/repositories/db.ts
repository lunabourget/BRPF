import Database, { type Database as DatabaseType } from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database.db');
export const db: DatabaseType = new Database(dbPath);

export function initDb(): void {
  const schemaPath = path.resolve(__dirname, '../database/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);
  console.log('Database initialized successfully.');
}