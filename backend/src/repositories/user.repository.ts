import { db } from './db.js';
import { randomUUID } from 'crypto';
import type { UserEntity } from '../interfaces/user.interface.js';


export class UserRepository {
  findByEmail(email: string): UserEntity | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as UserEntity | undefined;
  }

  findById(id: string): UserEntity | undefined {
    const stmt = db.prepare('SELECT id, name, surname, email, fictive_work, year, id_character_role, id_media, author FROM users WHERE id = ?');
    return stmt.get(id) as UserEntity | undefined;
  }

  create(userData: Omit<UserEntity, 'id'>): UserEntity {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, surname, email, password, fictive_work, year, id_character_role, id_media, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      userData.name || null,
      userData.surname,
      userData.email,
      userData.password,
      userData.fictive_work || null,
      userData.year || null,
      userData.id_character_role || null,
      userData.id_media || null,
      userData.author || null
    );

    return { id, ...userData };
  }

  getProfileWithDetails(userId: string) {
    const stmt = db.prepare(`
      SELECT 
        u.id, 
        u.name, 
        u.surname, 
        u.email, 
        u.fictive_work, 
        u.year, 
        u.author,
        r.name AS character_role,
        m.name AS media
      FROM users u
      LEFT JOIN character_roles r ON u.id_character_role = r.id
      LEFT JOIN medias m ON u.id_media = m.id
      WHERE u.id = ?
    `);
    return stmt.get(userId);
  }
}