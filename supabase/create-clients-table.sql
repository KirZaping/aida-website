-- Vérifier si la table clients existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'clients'
  ) THEN
    -- Créer la table clients
    CREATE TABLE clients (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nom VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      telephone VARCHAR(20),
      entreprise VARCHAR(255),
      adresse TEXT,
      code_postal VARCHAR(10),
      ville VARCHAR(100),
      pays VARCHAR(100) DEFAULT 'France',
      notes TEXT,
      date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Créer un trigger pour mettre à jour la date de modification
    CREATE TRIGGER update_clients_modified
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

    -- Activer RLS sur la table clients
    ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

    -- Créer les politiques RLS
    CREATE POLICY "Autoriser la lecture des clients pour les administrateurs" ON clients
      FOR SELECT USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Autoriser la modification des clients pour les administrateurs" ON clients
      FOR UPDATE USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Autoriser l'insertion des clients pour les administrateurs" ON clients
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
    CREATE POLICY "Autoriser la suppression des clients pour les administrateurs" ON clients
      FOR DELETE USING (auth.role() = 'authenticated');

    -- Ajouter une contrainte de clé étrangère à la table documents si elle existe
    IF EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'documents'
    ) THEN
      -- Vérifier si la contrainte existe déjà
      IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints
        WHERE constraint_name = 'documents_client_id_fkey'
        AND table_name = 'documents'
      ) THEN
        ALTER TABLE documents
        ADD CONSTRAINT documents_client_id_fkey
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
      END IF;
    END IF;
  END IF;
END $$;
