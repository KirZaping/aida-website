-- Création de la fonction pour vérifier si une table existe
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$ LANGUAGE plpgsql;

-- Création de la table pour les demandes de devis
CREATE TABLE IF NOT EXISTS devis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  services TEXT[] NOT NULL,
  budget TEXT NOT NULL,
  delai TEXT,
  description TEXT NOT NULL,
  statut TEXT DEFAULT 'nouveau',
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table pour les messages de contact
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table pour les inscriptions à la newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actif BOOLEAN DEFAULT TRUE
);

-- Création d'un trigger pour mettre à jour la date de modification des devis
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_modification = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_devis_modified ON devis;
CREATE TRIGGER update_devis_modified
BEFORE UPDATE ON devis
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Création des politiques de sécurité Row Level Security (RLS)
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Politiques pour les demandes de devis
DROP POLICY IF EXISTS "Autoriser l'insertion publique de devis" ON devis;
CREATE POLICY "Autoriser l'insertion publique de devis" ON devis
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Autoriser la lecture des devis pour les administrateurs" ON devis;
CREATE POLICY "Autoriser la lecture des devis pour les administrateurs" ON devis
  FOR SELECT USING (auth.role() = 'authenticated');

-- Politiques pour les messages de contact
DROP POLICY IF EXISTS "Autoriser l'insertion publique de contacts" ON contacts;
CREATE POLICY "Autoriser l'insertion publique de contacts" ON contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Autoriser la lecture des contacts pour les administrateurs" ON contacts;
CREATE POLICY "Autoriser la lecture des contacts pour les administrateurs" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Politiques pour les inscriptions à la newsletter
DROP POLICY IF EXISTS "Autoriser l'insertion publique de newsletter" ON newsletter;
CREATE POLICY "Autoriser l'insertion publique de newsletter" ON newsletter
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Autoriser la lecture des inscriptions pour les administrateurs" ON newsletter;
CREATE POLICY "Autoriser la lecture des inscriptions pour les administrateurs" ON newsletter
  FOR SELECT USING (auth.role() = 'authenticated');
