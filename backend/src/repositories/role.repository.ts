import { db } from './db.js';

export class RoleRepository {
  getAllRoles() {
    const stmt = db.prepare('SELECT id, name FROM character_roles ORDER BY name ASC');
    return stmt.all();
  }
}
