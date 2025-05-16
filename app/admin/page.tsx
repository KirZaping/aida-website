"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StatsCards } from "./components/stats-cards"
import { DevisTable } from "./components/devis-table"
import { DevisCharts } from "./components/devis-charts"
import { supabaseAdmin } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [devisList, setDevisList] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    en_cours: 0,
    termine: 0,
  })
  const [tableExists, setTableExists] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDevis()
  }, [])

  const fetchDevis = async () => {
    try {
      setLoading(true)
      setError(null)

      // Récupérer les devis depuis Supabase
      const { data, error } = await supabaseAdmin.from("devis").select("*").order("date_creation", { ascending: false })

      if (error) {
        console.error("Erreur lors de la récupération des devis:", error)

        // Vérifier si l'erreur est due à une table inexistante
        if (error.message && error.message.includes("does not exist")) {
          setTableExists(false)
          setError("La table 'devis' n'existe pas dans la base de données.")

          // Utiliser des données de démonstration
          const demoData = generateDemoData()
          setDevisList(demoData)
          calculateStats(demoData)
        } else {
          setError(`Erreur: ${error.message}`)
          setDevisList([])
          calculateStats([])
        }
      } else if (data) {
        setTableExists(true)
        setDevisList(data)
        calculateStats(data)
      }
    } catch (err) {
      console.error("Exception lors de la récupération des devis:", err)
      setError(`Exception: ${err instanceof Error ? err.message : "Erreur inconnue"}`)

      // Utiliser des données de démonstration en cas d'erreur
      const demoData = generateDemoData()
      setDevisList(demoData)
      calculateStats(demoData)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: any[]) => {
    const nouveaux = data.filter((d) => d.statut === "nouveau").length
    const enCours = data.filter((d) => d.statut === "en_cours").length
    const termines = data.filter((d) => d.statut === "termine").length

    setStats({
      total: data.length,
      nouveau: nouveaux,
      en_cours: enCours,
      termine: termines,
    })
  }

  const generateDemoData = () => {
    // Générer des données de démonstration pour le mode développement
    return Array.from({ length: 15 }, (_, i) => ({
      id: `demo-${i + 1}`,
      nom: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      telephone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      entreprise: `Entreprise ${i + 1}`,
      services: ["Site web", "SEO", "Design"].slice(0, Math.floor(Math.random() * 3) + 1),
      budget: ["moins-5k", "5k-10k", "10k-20k", "plus-20k"][Math.floor(Math.random() * 4)],
      delai: ["urgent", "1-3-mois", "3-6-mois", "plus-6-mois"][Math.floor(Math.random() * 4)],
      description: `Description du projet ${i + 1}. Ceci est une démonstration.`,
      statut: ["nouveau", "en_cours", "termine"][Math.floor(Math.random() * 3)],
      date_creation: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      date_modification: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Tableau de bord</h1>

      {!tableExists && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTitle>Table manquante</AlertTitle>
          <AlertDescription>
            La table "devis" n'existe pas dans la base de données. Les données affichées sont des exemples.
          </AlertDescription>
        </Alert>
      )}

      {error && !error.includes("does not exist") && (
        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <StatsCards stats={stats} />

      <Tabs defaultValue="apercu" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="devis">Devis récents</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          {!tableExists && <TabsTrigger value="create-table">Créer la table</TabsTrigger>}
        </TabsList>

        <TabsContent value="apercu">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Devis récents</CardTitle>
                <CardDescription>Les 5 derniers devis reçus</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <DevisTable devis={devisList.slice(0, 5)} demoMode={!tableExists} onRefresh={fetchDevis} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
                <CardDescription>Visualisation des devis par statut</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="h-40">
                    <DevisCharts devis={devisList} chartType="status" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devis">
          <Card>
            <CardHeader>
              <CardTitle>Tous les devis</CardTitle>
              <CardDescription>
                {tableExists
                  ? "Liste complète des devis reçus. Cliquez sur un devis pour voir les détails."
                  : "Données de démonstration. La table 'devis' n'existe pas dans la base de données."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <DevisTable devis={devisList} demoMode={!tableExists} onRefresh={fetchDevis} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques détaillées</CardTitle>
              <CardDescription>
                {tableExists
                  ? "Visualisation des données de devis par différentes catégories."
                  : "Statistiques basées sur des données de démonstration."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-80 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <DevisCharts devis={devisList} chartType="all" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {!tableExists && (
          <TabsContent value="create-table">
            <Card>
              <CardHeader>
                <CardTitle>Créer la table "devis"</CardTitle>
                <CardDescription>
                  Exécutez le script SQL ci-dessous dans l'interface SQL de Supabase pour créer la table "devis".
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-gray-900 p-4 text-sm text-gray-100">
                  <pre className="whitespace-pre-wrap">
                    {`-- Activer l'extension uuid-ossp si elle n'est pas déjà activée
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
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Autoriser la modification des devis pour les administrateurs" ON devis;
CREATE POLICY "Autoriser la modification des devis pour les administrateurs" ON devis
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
