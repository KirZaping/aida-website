"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, Search, UserPlus, Eye, Edit } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase"
import { addClient } from "../actions/clients"
import { formatDate } from "@/lib/utils"

export default function ClientsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])
  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tableExists, setTableExists] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    nom_entreprise: "",
    mot_de_passe: "password123", // Mot de passe par défaut
  })

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients)
    } else {
      const lowercasedSearch = searchTerm.toLowerCase()
      setFilteredClients(
        clients.filter(
          (client) =>
            (client.nom?.toLowerCase() || "").includes(lowercasedSearch) ||
            (client.prenom?.toLowerCase() || "").includes(lowercasedSearch) ||
            (client.email?.toLowerCase() || "").includes(lowercasedSearch) ||
            (client.nom_entreprise?.toLowerCase() || "").includes(lowercasedSearch),
        ),
      )
    }
  }, [searchTerm, clients])

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Début de la récupération des clients...")

      // Vérifier si la table clients existe
      const { data: tableData, error: tableError } = await supabaseAdmin
        .from("clients")
        .select("id")
        .limit(1)
        .maybeSingle()

      if (tableError) {
        console.error("Erreur lors de la vérification de la table clients:", tableError)

        // Vérifier si l'erreur est due à une table inexistante
        if (tableError.message && tableError.message.includes("does not exist")) {
          setTableExists(false)
          setError("La table 'clients' n'existe pas dans la base de données.")

          // Utiliser des données de démonstration
          const demoData = generateDemoData()
          setClients(demoData)
          setFilteredClients(demoData)
        } else {
          setError(`Erreur: ${tableError.message}`)
          setClients([])
          setFilteredClients([])
        }
      } else {
        // La table existe, récupérer les données
        console.log("La table clients existe, récupération des données...")

        // Utiliser une requête plus simple et directe
        const { data, error } = await supabaseAdmin.from("clients").select("*")

        console.log("Résultat de la requête:", { data, error })

        if (error) {
          console.error("Erreur lors de la récupération des clients:", error)
          setError(`Erreur: ${error.message}`)

          // Utiliser des données de démonstration en cas d'erreur
          const demoData = generateDemoData()
          setClients(demoData)
          setFilteredClients(demoData)
        } else if (data) {
          console.log(`${data.length} clients récupérés:`, data)
          setTableExists(true)
          setClients(data)
          setFilteredClients(data)
        } else {
          console.log("Aucun client trouvé dans la base de données")
          setClients([])
          setFilteredClients([])
        }
      }
    } catch (err) {
      console.error("Exception lors de la récupération des clients:", err)
      setError(`Exception: ${err instanceof Error ? err.message : "Erreur inconnue"}`)

      // Utiliser des données de démonstration en cas d'erreur
      const demoData = generateDemoData()
      setClients(demoData)
      setFilteredClients(demoData)
    } finally {
      setLoading(false)
    }
  }

  const generateDemoData = () => {
    // Générer des données de démonstration pour le mode développement
    return Array.from({ length: 10 }, (_, i) => ({
      id: `demo-${i + 1}`,
      nom: `Dupont ${i + 1}`,
      prenom: `Jean ${i + 1}`,
      email: `client${i + 1}@example.com`,
      telephone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      nom_entreprise: `Entreprise ${i + 1}`,
      nb_projets: Math.floor(Math.random() * 5),
      date_creation: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    setSaving(true)

    try {
      // Validation de base
      if (!formData.email || !formData.nom_entreprise) {
        setFormError("L'email et le nom de l'entreprise sont obligatoires.")
        setSaving(false)
        return
      }

      // Appeler l'action serveur pour ajouter le client
      const result = await addClient(formData)

      if (result.error) {
        setFormError(result.error)
      } else {
        setFormSuccess("Client ajouté avec succès !")
        // Réinitialiser le formulaire
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          nom_entreprise: "",
          mot_de_passe: "password123",
        })
        // Fermer le dialogue
        setTimeout(() => {
          setAddDialogOpen(false)
          fetchClients() // Rafraîchir la liste des clients
        }, 1500)
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error)
      setFormError("Une erreur est survenue lors de l'ajout du client.")
    } finally {
      setSaving(false)
    }
  }

  const handleViewClient = (id: string) => {
    router.push(`/admin/clients/${id}`)
  }

  const handleEditClient = (id: string) => {
    router.push(`/admin/clients/${id}/modifier`)
  }

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Gestion des clients</h1>

      {!tableExists && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTitle>Table manquante</AlertTitle>
          <AlertDescription>
            La table "clients" n'existe pas dans la base de données. Les données affichées sont des exemples.
          </AlertDescription>
        </Alert>
      )}

      {error && !error.includes("does not exist") && (
        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Liste des clients</CardTitle>
              <CardDescription>
                {tableExists
                  ? `${clients.length} client(s) trouvé(s)`
                  : "Données de démonstration. La table 'clients' n'existe pas dans la base de données."}
              </CardDescription>
            </div>
            <Button className="w-full sm:w-auto" onClick={() => setAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un client..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={fetchClients} className="w-full sm:w-auto">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Actualiser"}
            </Button>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun client trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {client.prenom} {client.nom}
                        </TableCell>
                        <TableCell>{client.nom_entreprise || "-"}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.telephone || "-"}</TableCell>
                        <TableCell>{formatDate(client.date_creation)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewClient(client.id)}
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClient(client.id)}
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!tableExists && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Créer la table "clients"</CardTitle>
            <CardDescription>
              Exécutez le script SQL ci-dessous dans l'interface SQL de Supabase pour créer la table "clients".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-gray-900 p-4 text-sm text-gray-100">
              <pre className="whitespace-pre-wrap">
                {`-- Activer l'extension uuid-ossp si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de la table pour les clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  prenom TEXT,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT,
  nom_entreprise TEXT NOT NULL,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  pays TEXT DEFAULT 'France',
  nb_projets INTEGER DEFAULT 0,
  notes TEXT,
  mot_de_passe TEXT NOT NULL,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un trigger pour mettre à jour la date de modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_modification = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_clients_modified ON clients;
CREATE TRIGGER update_clients_modified
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Création des politiques de sécurité Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Politiques pour les clients
DROP POLICY IF EXISTS "Autoriser la lecture des clients pour les administrateurs" ON clients;
CREATE POLICY "Autoriser la lecture des clients pour les administrateurs" ON clients
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Autoriser la modification des clients pour les administrateurs" ON clients;
CREATE POLICY "Autoriser la modification des clients pour les administrateurs" ON clients
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogue d'ajout de client */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogDescription>Remplissez les informations ci-dessous pour créer un nouveau client.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Dupont" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom_entreprise">Entreprise *</Label>
                <Input
                  id="nom_entreprise"
                  name="nom_entreprise"
                  value={formData.nom_entreprise}
                  onChange={handleInputChange}
                  placeholder="Nom de l'entreprise"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mot_de_passe">Mot de passe</Label>
                <Input
                  id="mot_de_passe"
                  name="mot_de_passe"
                  type="password"
                  value={formData.mot_de_passe}
                  onChange={handleInputChange}
                  placeholder="Mot de passe"
                />
                <p className="text-xs text-gray-500">
                  Le mot de passe par défaut est "password123". Le client pourra le modifier ultérieurement.
                </p>
              </div>
            </div>
            {formError && (
              <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            {formSuccess && (
              <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{formSuccess}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Ajouter le client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
