-- Créer la table admin_users si elle n'existe pas
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'admin',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supprimer l'utilisateur admin s'il existe déjà (pour éviter les doublons)
DELETE FROM admin_users WHERE username = 'admin';

-- Insérer l'utilisateur admin par défaut
-- Note: Dans un environnement de production, le mot de passe devrait être haché
INSERT INTO admin_users (username, password, email, role)
VALUES ('admin', 'admin', 'admin@example.com', 'super_admin');

-- Vérifier que l'utilisateur a été créé
SELECT username, role FROM admin_users WHERE username = 'admin';
