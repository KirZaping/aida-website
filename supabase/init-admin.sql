-- Fonction pour vérifier si une table existe
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = table_name
  );
END;
$$ LANGUAGE plpgsql;

-- Créer la table devis si elle n'existe pas
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

-- Ajouter des données de test si la table est vide
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM devis) = 0 THEN
    INSERT INTO devis (nom, email, telephone, entreprise, services, budget, delai, description, statut, date_creation, date_modification)
    VALUES
      ('Jean Dupont', 'jean.dupont@example.com', '0612345678', 'Dupont SAS', ARRAY['Site web', 'SEO'], '5 000 € - 10 000 €', '3 mois', 'Nous souhaitons refaire notre site web et améliorer notre référencement.', 'nouveau', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
      ('Marie Martin', 'marie.martin@example.com', '0687654321', 'Martin & Co', ARRAY['Design', 'Branding'], '< 5 000 €', '1 mois', 'Nous avons besoin d''un nouveau logo et d''une charte graphique.', 'en_cours', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
      ('Pierre Durand', 'pierre.durand@example.com', '0698765432', 'Durand SARL', ARRAY['Site web', 'Application mobile'], '> 10 000 €', '6 mois', 'Nous souhaitons développer une application mobile et un site web pour notre entreprise.', 'termine', NOW() - INTERVAL '15 days', NOW() - INTERVAL '3 days');
  END IF;
END $$;

-- Vérifier que la table a été créée
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'devis'
);
