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
  const claimColumns = db.prepare('PRAGMA table_info(claims)').all() as Array<{ name: string }>;
  if (!claimColumns.some(column => column.name === 'id_character_role')) {
    db.exec('ALTER TABLE claims ADD COLUMN id_character_role TEXT REFERENCES character_roles(id) ON DELETE SET NULL');
  }
  if (!claimColumns.some(column => column.name === 'description')) {
    db.exec('ALTER TABLE claims ADD COLUMN description TEXT');
  }
  db.exec("UPDATE claims SET name = description WHERE description IS NOT NULL AND description <> ''");
  console.log('Database initialized successfully.');
}