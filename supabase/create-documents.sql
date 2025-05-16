-- Créer la table documents si elle n'existe pas
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- facture, devis, contrat, etc.
  statut VARCHAR(50) NOT NULL, -- en_attente, payé, signé, etc.
  montant DECIMAL(10, 2),
  fichier_path TEXT,
  fichier_nom VARCHAR(255),
  fichier_type VARCHAR(50),
  fichier_taille INTEGER,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT documents_type_check CHECK (type IN ('facture', 'devis', 'contrat', 'autre')),
  CONSTRAINT documents_statut_check CHECK (statut IN ('en_attente', 'payé', 'signé', 'refusé', 'expiré', 'brouillon'))
);

-- Créer la table des partages de documents si elle n'existe pas
CREATE TABLE IF NOT EXISTS document_partages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  token VARCHAR(100) NOT NULL UNIQUE,
  email_destinataire VARCHAR(255),
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_expiration TIMESTAMP WITH TIME ZONE NOT NULL,
  est_consulte BOOLEAN DEFAULT FALSE,
  date_consultation TIMESTAMP WITH TIME ZONE,
  CONSTRAINT document_partages_token_unique UNIQUE (token)
);

-- Créer la table des notifications de documents si elle n'existe pas
CREATE TABLE IF NOT EXISTS document_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL, -- nouveau_document, rappel, etc.
  message TEXT NOT NULL,
  est_lu BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_lecture TIMESTAMP WITH TIME ZONE
);

-- Activer RLS sur les tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_partages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_notifications ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour permettre l'accès aux administrateurs
CREATE POLICY "Autoriser l'accès complet aux documents pour les administrateurs" ON documents
  FOR ALL USING (true);

CREATE POLICY "Autoriser l'accès complet aux partages pour les administrateurs" ON document_partages
  FOR ALL USING (true);

CREATE POLICY "Autoriser l'accès complet aux notifications pour les administrateurs" ON document_notifications
  FOR ALL USING (true);

-- Insérer quelques documents de test si la table est vide
DO $$
DECLARE
  client_id_1 UUID;
  client_id_2 UUID;
BEGIN
  -- Vérifier si nous avons des clients
  SELECT id INTO client_id_1 FROM clients LIMIT 1;
  
  IF client_id_1 IS NOT NULL THEN
    -- Vérifier si nous avons déjà des documents
    IF NOT EXISTS (SELECT 1 FROM documents LIMIT 1) THEN
      -- Insérer quelques documents de test pour le premier client
      INSERT INTO documents (client_id, titre, description, type, statut, montant)
      VALUES 
        (client_id_1, 'Facture #2023-001', 'Facture pour services de développement web', 'facture', 'en_attente', 1500.00),
        (client_id_1, 'Devis #2023-001', 'Devis pour refonte du site web', 'devis', 'en_attente', 3000.00);
      
      -- Essayer de trouver un deuxième client
      SELECT id INTO client_id_2 FROM clients WHERE id != client_id_1 LIMIT 1;
      
      IF client_id_2 IS NOT NULL THEN
        -- Insérer des documents pour le deuxième client
        INSERT INTO documents (client_id, titre, description, type, statut, montant)
        VALUES 
          (client_id_2, 'Contrat de maintenance', 'Contrat annuel de maintenance du site web', 'contrat', 'signé', 1200.00),
          (client_id_2, 'Facture #2023-002', 'Facture pour services de référencement', 'facture', 'payé', 800.00);
      END IF;
    END IF;
  END IF;
END $$;
