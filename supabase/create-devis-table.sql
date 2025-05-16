-- Activer l'extension uuid-ossp si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Politiques pour les demandes de devis
DROP POLICY IF EXISTS "Autoriser l'insertion publique de devis" ON devis;
CREATE POLICY "Autoriser l'insertion publique de devis" ON devis
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Autoriser la lecture des devis pour les administrateurs" ON devis;
CREATE POLICY "Autoriser la lecture des devis pour les administrateurs" ON devis
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Autoriser la modification des devis pour les administrateurs" ON devis;
CREATE POLICY "Autoriser la modification des devis pour les administrateurs" ON devis
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insérer quelques données de test
INSERT INTO devis (nom, email, telephone, entreprise, services, budget, delai, description, statut)
VALUES 
('Jean Dupont', 'jean.dupont@example.com', '0612345678', 'Entreprise A', ARRAY['Site web', 'SEO'], 'moins-5k', 'urgent', 'Je souhaite un site vitrine pour mon entreprise.', 'nouveau'),
('Marie Martin', 'marie.martin@example.com', '0687654321', 'Entreprise B', ARRAY['Site web', 'Design', 'Branding'], '10k-20k', '3-6-mois', 'Nous avons besoin d''une refonte complète de notre identité visuelle et de notre site web.', 'en_cours'),
('Pierre Durand', 'pierre.durand@example.com', '0654321987', 'Entreprise C', ARRAY['Application mobile', 'Design'], 'plus-20k', 'plus-6-mois', 'Nous souhaitons développer une application mobile pour nos clients.', 'termine');

-- Vérifier que la table a été créée
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'devis'
);
