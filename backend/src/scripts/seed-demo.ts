import bcrypt from 'bcrypt';
import { db, initDb } from '../repositories/db.js';

const demoUserId = 'demo-user-global-preview';
const demoEmail = 'demo@brpf.local';
const demoPassword = 'Demo2026!';

export async function seedDemo(): Promise<void> {
  const passwordHash = await bcrypt.hash(demoPassword, 10);
  const insertUser = db.prepare(`
    INSERT INTO users (
      id, name, surname, email, password, fictive_work, year,
      id_character_role, id_media, author
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertClaim = db.prepare(`
    INSERT INTO claims (
      id, name, id_user, id_character_role,
      id_status, id_category, nb_refus, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertResponse = db.prepare(`
    INSERT INTO responses (id, text, id_claim, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    db.prepare('DELETE FROM users WHERE id = ?').run(demoUserId);

    insertUser.run(
      demoUserId,
      'Homer',
      'Simpson',
      demoEmail,
      passwordHash,
      'Les Simpsons',
      1989,
      'role-1',
      'med-1',
      'BRPF Demo'
    );

    insertClaim.run(
      'ertjryuodrgazruryi',
      'J’étrangle bart tout le temps, c’est pas normal !',
      demoUserId,
      'role-1',
      'stat-1',
      'cat-0',
      0,
      '2026-01-15 09:30:00'
    );

    insertClaim.run(
      'demo-claim-accepted',
      'Je voudrais passer plus de temps au bar.',
      demoUserId,
      'role-3',
      'stat-2',
      'cat-1',
      0,
      '2026-02-20 14:15:00'
    );

    insertClaim.run(
      'demo-claim-rejected',
      'J’en peux plus des donuts, c’est pas sain pour ma santé.',
      demoUserId,
      'role-2',
      'stat-3',
      'cat-2',
      1,
      '2026-03-12 11:45:00'
    );
    insertResponse.run(
      'demo-response-rejected',
      'Après examen, le comité maintient sa décision et considère cette feature comme trop attachée à votre personnage pour la retirer.',
      'demo-claim-rejected',
      '2026-03-18 16:20:00'
    );

    insertClaim.run(
      'demo-claim-cancelled',
      'Je souhaite annuler ma précédente demande de réclamation.',
      demoUserId,
      'role-8',
      'stat-5',
      'cat-0',
      0,
      '2026-04-05 08:10:00'
    );
  });

  seed();
  console.log('Données de démonstration injectées.');
  console.log(`Email : ${demoEmail}`);
  console.log(`Mot de passe : ${demoPassword}`);
  console.log('Les réclamations couvrent les statuts : En cours, Acceptée, Refusée et Annulée.');
}

if (process.argv[1]?.endsWith('seed-demo.js')) {
  initDb();
  seedDemo()
    .then(() => db.close())
    .catch((error) => {
      console.error('Échec de l’injection des données de démonstration :', error);
      db.close();
      process.exitCode = 1;
    });
}
