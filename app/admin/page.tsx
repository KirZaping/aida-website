"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StatsCards } from "./components/stats-cards"
import { DevisTable } from "./components/devis-table"
import { DevisCharts } from "./components/devis-charts"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientsTable } from "./components/clients-table"
import { DocumentsTable } from "./components/documents-table"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [devisList, setDevisList] = useState<any[]>([])
  const [clientsList, setClientsList] = useState<any[]>([])
  const [documentsList, setDocumentsList] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    en_cours: 0,
    termine: 0,
    clients: 0,
    documents: 0,
    projets: 0,
  })
  const [tableExists, setTableExists] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Appeler l'API route pour récupérer toutes les données
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des données")
      }

      const { devis, clients, documents } = result.data
      const errors = result.errors

      // Vérifier si la table devis existe
      if (errors.devis && errors.devis.includes("does not exist")) {
        setTableExists(false)
        setError("La table 'devis' n'existe pas dans la base de données.")

        // Utiliser des données de démonstration
        const demoData = generateDemoData()
        setDevisList(demoData)
        calculateStats(demoData, clients, documents)
      } else {
        setTableExists(true)
        setDevisList(devis)
        calculateStats(devis, clients, documents)
      }

      // Définir les autres données
      setClientsList(clients)
      setDocumentsList(documents)

      // Afficher les erreurs non critiques
      if (errors.clients && !errors.clients.includes("does not exist")) {
        console.warn("Avertissement clients:", errors.clients)
      }
      if (errors.documents && !errors.documents.includes("does not exist")) {
        console.warn("Avertissement documents:", errors.documents)
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err)
      setError(`Erreur: ${err instanceof Error ? err.message : "Erreur inconnue"}`)

      // Utiliser des données de démonstration en cas d'erreur
      const demoData = generateDemoData()
      setDevisList(demoData)
      setClientsList([])
      setDocumentsList([])
      calculateStats(demoData, [], [])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (devisData: any[], clientsData: any[], documentsData: any[]) => {
    const nouveaux = devisData.filter((d) => d.statut === "nouveau").length
    const enCours = devisData.filter((d) => d.statut === "en_cours").length
    const termines = devisData.filter((d) => d.statut === "termine").length

    setStats({
      total: devisData.length,
      nouveau: nouveaux,
      en_cours: enCours,
      termine: termines,
      clients: clientsData.length,
      documents: documentsData.length,
      projets: 0, // À implémenter si vous avez une table de projets
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <Button
          onClick={fetchAllData}
          variant="outline"
          size="sm"
          className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {!tableExists && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertTitle className="text-amber-800">Table manquante</AlertTitle>
          <AlertDescription className="text-amber-700">
            La table "devis" n'existe pas dans la base de données. Les données affichées sont des exemples.
          </AlertDescription>
        </Alert>
      )}

      {error && !error.includes("does not exist") && (
        <Alert className="mb-6 border-red-300 bg-red-50">
          <AlertTitle className="text-red-800">Erreur</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <StatsCards stats={stats} />

      <Tabs defaultValue="apercu" className="mt-8">
        <TabsList className="mb-4 bg-gray-100">
          <TabsTrigger
            value="apercu"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            Aperçu
          </TabsTrigger>
          <TabsTrigger
            value="devis"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            Devis
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            Clients
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="statistiques"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            Statistiques
          </TabsTrigger>
          {!tableExists && (
            <TabsTrigger
              value="create-table"
              className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Créer la table
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="apercu">
          <div className="flex flex-col gap-6">
            <Card className="w-full bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-900">Devis récents</CardTitle>
                <CardDescription className="text-gray-600">Les 5 derniers devis reçus</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <DevisTable devis={devisList.slice(0, 5)} demoMode={!tableExists} onRefresh={fetchAllData} />
                )}
              </CardContent>
            </Card>

            <Card className="w-full bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-900">Clients récents</CardTitle>
                <CardDescription className="text-gray-600">Les 5 derniers clients ajoutés</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : clientsList.length > 0 ? (
                  <ClientsTable clients={clientsList.slice(0, 5)} />
                ) : (
                  <p className="text-sm text-gray-600 py-4">Aucun client trouvé.</p>
                )}
              </CardContent>
            </Card>

            <Card className="w-full bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-900">Documents récents</CardTitle>
                <CardDescription className="text-gray-600">Les 5 derniers documents ajoutés</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : documentsList.length > 0 ? (
                  <DocumentsTable documents={documentsList.slice(0, 5)} />
                ) : (
                  <p className="text-sm text-gray-600 py-4">Aucun document trouvé dans la base de données.</p>
                )}
              </CardContent>
            </Card>

            <Card className="w-full bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-900">Répartition par statut</CardTitle>
                <CardDescription className="text-gray-600">Visualisation des devis par statut</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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

            <Card className="w-full bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-900">Activité récente</CardTitle>
                <CardDescription className="text-gray-600">Dernières actions effectuées</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex h-40 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {devisList.length > 0 && (
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          <span className="text-gray-700">Nouveau devis de {devisList[0].nom}</span>
                        </li>
                      )}
                      {clientsList.length > 0 && (
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          <span className="text-gray-700">Nouveau client: {clientsList[0].nom}</span>
                        </li>
                      )}
                      {documentsList.length > 0 && (
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                          <span className="text-gray-700">Nouveau document: {documentsList[0].titre}</span>
                        </li>
                      )}
                      {devisList.length > 1 && (
                        <li className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                          <span className="text-gray-700">Devis mis à jour: {devisList[1].nom}</span>
                        </li>
                      )}
                      {devisList.length === 0 && clientsList.length === 0 && documentsList.length === 0 && (
                        <li className="text-gray-600">Aucune activité récente</li>
                      )}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devis">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">Tous les devis</CardTitle>
              <CardDescription className="text-gray-600">
                {tableExists
                  ? "Liste complète des devis reçus. Cliquez sur un devis pour voir les détails."
                  : "Données de démonstration. La table 'devis' n'existe pas dans la base de données."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <DevisTable devis={devisList} demoMode={!tableExists} onRefresh={fetchAllData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">Tous les clients</CardTitle>
              <CardDescription className="text-gray-600">
                Liste complète des clients enregistrés dans la base de données.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : clientsList.length > 0 ? (
                <ClientsTable clients={clientsList} />
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-600">Aucun client trouvé dans la base de données.</p>
                  <Button variant="outline" className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                    <a href="/admin/clients/ajouter">Ajouter un client</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">Tous les documents</CardTitle>
              <CardDescription className="text-gray-600">
                Liste complète des documents enregistrés dans la base de données.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : documentsList.length > 0 ? (
                <DocumentsTable documents={documentsList} />
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-600">Aucun document trouvé dans la base de données.</p>
                  <Button variant="outline" className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                    <a href="/admin/documents/ajouter">Ajouter un document</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">Statistiques détaillées</CardTitle>
              <CardDescription className="text-gray-600">
                {tableExists
                  ? "Visualisation des données par différentes catégories."
                  : "Statistiques basées sur des données de démonstration."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex h-80 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900">Répartition des devis</h3>
                    <DevisCharts devis={devisList} chartType="all" />
                  </div>

                  {clientsList.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-900">Répartition des clients par type</h3>
                      <div className="h-40">
                        <div className="flex justify-around h-full items-end">
                          {["client", "prospect", "lead"].map((type) => {
                            const count = clientsList.filter((c) => c.type === type).length
                            return (
                              <div key={type} className="flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-900">{count}</div>
                                <div
                                  className="w-16 bg-blue-600 rounded-t-md"
                                  style={{
                                    height: `${Math.max(30, (count / clientsList.length) * 200)}px`,
                                  }}
                                ></div>
                                <div className="text-sm mt-2 text-gray-700">{type}</div>
                              </div>
                            )
                          })}
                          {clientsList.some((c) => !c.type) && (
                            <div className="flex flex-col items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {clientsList.filter((c) => !c.type).length}
                              </div>
                              <div
                                className="w-16 bg-gray-300 rounded-t-md"
                                style={{
                                  height: `${Math.max(30, (clientsList.filter((c) => !c.type).length / clientsList.length) * 200)}px`,
                                }}
                              ></div>
                              <div className="text-sm mt-2 text-gray-700">Non défini</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {documentsList.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-900">Répartition des documents par type</h3>
                      <div className="h-40">
                        <div className="flex justify-around h-full items-end">
                          {Array.from(new Set(documentsList.map((d) => d.type))).map((type) => {
                            const count = documentsList.filter((d) => d.type === type).length
                            return (
                              <div key={type} className="flex flex-col items-center">
                                <div className="text-sm font-medium text-gray-900">{count}</div>
                                <div
                                  className="w-16 bg-purple-500 rounded-t-md"
                                  style={{
                                    height: `${Math.max(30, (count / documentsList.length) * 200)}px`,
                                  }}
                                ></div>
                                <div className="text-sm mt-2 text-gray-700">{type}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {!tableExists && (
          <TabsContent value="create-table">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-900">Créer la table "devis"</CardTitle>
                <CardDescription className="text-gray-600">
                  Exécutez le script SQL ci-dessous dans l'interface SQL de Supabase pour créer la table "devis".
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
