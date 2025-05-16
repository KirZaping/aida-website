-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  entreprise VARCHAR(255) NOT NULL,
  raison_sociale VARCHAR(255),
  siret VARCHAR(14),
  adresse TEXT,
  code_postal VARCHAR(10),
  ville VARCHAR(100),
  pays VARCHAR(100) DEFAULT 'France',
  telephone VARCHAR(20),
  forme_juridique VARCHAR(50),
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contact_nom VARCHAR(255),
  contact_email VARCHAR(255),
  contact_telephone VARCHAR(20)
);

-- Table des documents clients
CREATE TABLE IF NOT EXISTS documents_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- facture, devis, contrat, etc.
  statut VARCHAR(50) NOT NULL, -- en_attente, payé, signé, etc.
  url TEXT,
  fichier_path TEXT,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  montant DECIMAL(10, 2),
  CONSTRAINT documents_clients_type_check CHECK (type IN ('facture', 'devis', 'contrat', 'autre'))
);

-- Table des projets
CREATE TABLE IF NOT EXISTS projets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  statut VARCHAR(50) NOT NULL DEFAULT 'en_cours',
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_debut TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_fin TIMESTAMP WITH TIME ZONE,
  progression INTEGER DEFAULT 0,
  CONSTRAINT projets_statut_check CHECK (statut IN ('en_cours', 'terminé', 'annulé', 'en_pause'))
);

-- Ajouter des données de démonstration
INSERT INTO clients (email, mot_de_passe, entreprise, raison_sociale, siret, adresse, code_postal, ville, telephone, forme_juridique, contact_nom, contact_email, contact_telephone)
VALUES 
('demo@example.com', 'password123', 'Entreprise Démo', 'Entreprise Démo SARL', '12345678901234', '123 Avenue des Champs-Élysées', '75008', 'Paris', '01 23 45 67 89', 'SARL', 'Jean Dupont', 'jean.dupont@entreprise-demo.com', '06 12 34 56 78')
ON CONFLICT (email) DO NOTHING;

-- Récupérer l'ID du client démo
DO $$
DECLARE
  client_id UUID;
BEGIN
  SELECT id INTO client_id FROM clients WHERE email = 'demo@example.com';
  
  -- Insérer des documents pour le client démo
  INSERT INTO documents_clients (client_id, nom, description, type, statut, url, date_creation, montant)
  VALUES 
    (client_id, 'Facture #2023-001', 'Facture pour le développement du site web', 'facture', 'payé', '#', '2023-01-15', 2500),
    (client_id, 'Contrat de prestation', 'Contrat pour le développement du site web et la maintenance', 'contrat', 'signé', '#', '2023-01-10', NULL),
    (client_id, 'Facture #2023-002', 'Facture pour la maintenance mensuelle', 'facture', 'en_attente', '#', '2023-02-15', 500),
    (client_id, 'Devis #2023-003', 'Devis pour l''ajout de fonctionnalités e-commerce', 'devis', 'en_attente', '#', '2023-03-05', 1800)
  ON CONFLICT DO NOTHING;
  
  -- Insérer des projets pour le client démo
  INSERT INTO projets (client_id, nom, description, statut, date_creation, date_fin, progression)
  VALUES 
    (client_id, 'Site web vitrine', 'Développement d''un site web vitrine responsive avec intégration de formulaires de contact et d''une carte interactive.', 'terminé', '2023-01-05', '2023-02-15', 100),
    (client_id, 'Application mobile', 'Développement d''une application mobile iOS et Android pour la gestion des commandes et le suivi des livraisons.', 'en_cours', '2023-03-10', NULL, 75),
    (client_id, 'Module e-commerce', 'Intégration d''un module e-commerce complet avec paiement en ligne, gestion des stocks et suivi des commandes.', 'en_cours', '2023-04-20', NULL, 40)
  ON CONFLICT DO NOTHING;
END $$;
