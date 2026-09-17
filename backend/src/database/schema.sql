-- 1. Tables de référence indépendantes
CREATE TABLE IF NOT EXISTS character_roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS medias (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS status (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 2. Table users (fait référence à character_roles et medias)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    fictive_work TEXT,
    year INTEGER,
    id_character_role TEXT,
    id_media TEXT,
    author TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_character_role) REFERENCES character_roles(id) ON DELETE SET NULL,
    FOREIGN KEY (id_media) REFERENCES medias(id) ON DELETE SET NULL
);

-- 3. Table claims (fait référence à users, status et categories)
CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    id_user TEXT NOT NULL,
    id_character_role TEXT,
    id_status TEXT NOT NULL,
    id_category TEXT,
    nb_refus INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_character_role) REFERENCES character_roles(id) ON DELETE SET NULL,
    FOREIGN KEY (id_status) REFERENCES status(id) ON DELETE CASCADE,
    FOREIGN KEY (id_category) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Table responses (fait référence à claims)
CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    id_claim TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_claim) REFERENCES claims(id) ON DELETE CASCADE
);


-- 1. Statuts
INSERT OR IGNORE INTO status (id, name) VALUES 
  ('stat-1', 'En cours'),
  ('stat-2', 'Acceptée'),
  ('stat-3', 'Refusée'),
  ('stat-4', 'Invalide');

-- 2. Catégories / Tags
INSERT OR IGNORE INTO categories (id, name) VALUES 
  ('cat-0', 'Non catégorisé'),
  ('cat-1', 'Scénario incohérent'),
  ('cat-2', 'Mort injustifiée'),
  ('cat-3', 'Temps d écran insuffisant'),
  ('cat-4', 'Dialogue médiocre');

-- 3. Médias
INSERT OR IGNORE INTO medias (id, name) VALUES 
  ('med-1', 'Film'),
  ('med-2', 'Jeu Vidéo'),
  ('med-3', 'Livre');

-- 4. Rôles
INSERT OR IGNORE INTO character_roles (id, name) VALUES 
  ('role-1', 'Héros·ïne'),
  ('role-2', 'Méchant·e'),
  ('role-3', 'Personnage secondaire'),
  ('role-4', 'Mentor·e'),
  ('role-5', 'Acolyte / Faire-valoir'),
  ('role-6', 'Narrateur·ice'),
  ('role-7', 'Figurant·e'),
  ('role-8', 'Autre');


-- 5. Utilisateur de test
INSERT OR IGNORE INTO users (id, name, surname, email, password, fictive_work, year, id_character_role, id_media, author) VALUES 
  ('user-1', 'Shrek', 'L Ogre', 'shrek@fort-fort-lointain.fr', 'Ogre2026!', 'Shrek 1', 2001, 'role-1', 'med-1', 'DreamWorks');

-- 6. Réclamation de test
INSERT OR IGNORE INTO claims (id, name, id_user, id_status, id_category, nb_refus) VALUES 
  ('claim-1', 'Contestation de l expulsion du marais', 'user-1', 'stat-3', 'cat-1', 1);

-- 7. Réponse associée à la réclamation
INSERT OR IGNORE INTO responses (id, text, id_claim) VALUES 
  ('resp-1', 'Réclamation refusée par le SAV : Votre mort apporte de la profondeur dramatique à l œuvre.', 'claim-1');
