"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Search, FileUp, Download, Eye, Trash2, Info } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase"
import { formatDate, formatFileSize } from "@/lib/utils"

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tableExists, setTableExists] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("tous")
  const [debug, setDebug] = useState<any>(null)

  // Formulaire d'upload
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    type: "facture",
    statut: "en_attente",
    montant: "",
    client_id: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchDocuments()
    fetchClients()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [searchTerm, documents, activeTab, selectedClient])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      setDebug(null)

      // Vérifier si la table documents existe
      const { error: tableError } = await supabaseAdmin.from("documents").select("count").limit(1)

      if (tableError) {
        console.error("Erreur lors de la vérification de la table documents:", tableError)
        setTableExists(false)
        setError("La table 'documents' n'existe pas dans la base de données.")
        setDocuments([])
        setFilteredDocuments([])
        setLoading(false)
        return
      }

      // Récupérer tous les documents sans jointure
      const { data, error } = await supabaseAdmin
        .from("documents")
        .select("*")
        .order("date_creation", { ascending: false })

      if (error) {
        console.error("Erreur lors de la récupération des documents:", error)
        setError(`Erreur: ${error.message}`)
        setDocuments([])
        setFilteredDocuments([])
        setLoading(false)
        return
      }

      // Afficher le nombre de documents récupérés pour le débogage
      console.log(`${data?.length || 0} documents récupérés`)
      setDebug({ documentsCount: data?.length || 0 })

      if (!data || data.length === 0) {
        setDocuments([])
        setFilteredDocuments([])
        setLoading(false)
        return
      }

      // Si nous avons des documents, récupérons les informations des clients
      const documentsWithClients = [...data]

      // Récupérer tous les IDs de clients uniques
      const clientIds = [...new Set(data.map((doc) => doc.client_id))]

      if (clientIds.length > 0) {
        // Vérifier si la table clients existe
        const { error: clientsTableError } = await supabaseAdmin.from("clients").select("count").limit(1)

        if (!clientsTableError) {
          // Récupérer les informations des clients
          const { data: clientsData, error: clientsError } = await supabaseAdmin
            .from("clients")
            .select("id, nom, email, nom_entreprise")
            .in("id", clientIds)

          if (!clientsError && clientsData) {
            // Créer un map des clients pour un accès rapide
            const clientsMap = clientsData.reduce((acc, client) => {
              acc[client.id] = client
              return acc
            }, {})

            // Ajouter les informations des clients aux documents
            documentsWithClients.forEach((doc) => {
              doc.clients = clientsMap[doc.client_id] || null
            })
          } else if (clientsError) {
            console.error("Erreur lors de la récupération des clients:", clientsError)
          }
        }
      }

      setDocuments(documentsWithClients)
      filterDocuments(documentsWithClients)
    } catch (err) {
      console.error("Exception lors de la récupération des documents:", err)
      setError(`Exception: ${err instanceof Error ? err.message : "Erreur inconnue"}`)
      setDocuments([])
      setFilteredDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      // Vérifier si la table clients existe
      const { error: tableError } = await supabaseAdmin.from("clients").select("count").limit(1)

      if (tableError) {
        console.error("Erreur lors de la vérification de la table clients:", tableError)
        setClients([])
        return
      }

      // Récupérer les clients
      const { data, error } = await supabaseAdmin
        .from("clients")
        .select("id, nom, email, nom_entreprise")
        .order("nom", { ascending: true })

      if (error) {
        console.error("Erreur lors de la récupération des clients:", error)
        setClients([])
      } else if (data) {
        setClients(data)
      }
    } catch (err) {
      console.error("Exception lors de la récupération des clients:", err)
      setClients([])
    }
  }

  const filterDocuments = (docs = documents) => {
    let filtered = [...docs]

    // Filtrer par type de document
    if (activeTab !== "tous") {
      filtered = filtered.filter((doc) => doc.type === activeTab)
    }

    // Filtrer par client
    if (selectedClient && selectedClient !== "all") {
      filtered = filtered.filter((doc) => doc.client_id === selectedClient)
    }

    // Filtrer par terme de recherche
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.titre?.toLowerCase().includes(lowercasedSearch) ||
          doc.description?.toLowerCase().includes(lowercasedSearch) ||
          doc.clients?.nom?.toLowerCase().includes(lowercasedSearch) ||
          doc.clients?.nom_entreprise?.toLowerCase().includes(lowercasedSearch),
      )
    }

    setFilteredDocuments(filtered)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setUploadError("Veuillez sélectionner un fichier")
      return
    }

    if (!formData.client_id) {
      setUploadError("Veuillez sélectionner un client")
      return
    }

    try {
      setUploadLoading(true)
      setUploadError(null)
      setUploadSuccess(false)

      // Vérifier si le client existe
      const { data: clientData, error: clientError } = await supabaseAdmin
        .from("clients")
        .select("id")
        .eq("id", formData.client_id)
        .single()

      if (clientError || !clientData) {
        setUploadError("Client non trouvé")
        setUploadLoading(false)
        return
      }

      // Télécharger le fichier dans le bucket Storage
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `documents/${formData.client_id}/${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage.from("client-documents").upload(filePath, selectedFile)

      if (uploadError) {
        console.error("Erreur lors du téléchargement du fichier:", uploadError)
        setUploadError("Erreur lors du téléchargement du fichier")
        setUploadLoading(false)
        return
      }

      // Créer l'entrée dans la table documents
      const { error: insertError } = await supabaseAdmin.from("documents").insert({
        client_id: formData.client_id,
        titre: formData.titre,
        description: formData.description,
        type: formData.type,
        statut: formData.statut,
        montant: formData.montant ? Number.parseFloat(formData.montant) : null,
        fichier_path: filePath,
        fichier_nom: selectedFile.name,
        fichier_type: selectedFile.type,
        fichier_taille: selectedFile.size,
      })

      if (insertError) {
        console.error("Erreur lors de l'insertion du document:", insertError)
        setUploadError("Erreur lors de l'enregistrement du document")
        setUploadLoading(false)
        return
      }

      // Créer une notification pour le client
      await supabaseAdmin.from("document_notifications").insert({
        document_id: (await supabaseAdmin.from("documents").select("id").eq("fichier_path", filePath).single()).data
          ?.id,
        client_id: formData.client_id,
        type: "nouveau_document",
        message: `Un nouveau document "${formData.titre}" a été ajouté à votre espace client`,
      })

      setUploadSuccess(true)
      setFormData({
        titre: "",
        description: "",
        type: "facture",
        statut: "en_attente",
        montant: "",
        client_id: "",
      })
      setSelectedFile(null)

      // Rafraîchir la liste des documents
      fetchDocuments()

      // Fermer la boîte de dialogue après 2 secondes
      setTimeout(() => {
        setUploadDialogOpen(false)
        setUploadSuccess(false)
      }, 2000)
    } catch (err) {
      console.error("Exception lors du téléchargement:", err)
      setUploadError(`Exception: ${err instanceof Error ? err.message : "Erreur inconnue"}`)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return
    }

    try {
      // Récupérer le chemin du fichier
      const { data: document, error: fetchError } = await supabaseAdmin
        .from("documents")
        .select("fichier_path")
        .eq("id", documentId)
        .single()

      if (fetchError) {
        console.error("Erreur lors de la récupération du document:", fetchError)
        alert("Erreur lors de la suppression du document")
        return
      }

      // Supprimer le fichier du stockage
      if (document.fichier_path) {
        const { error: storageError } = await supabaseAdmin.storage
          .from("client-documents")
          .remove([document.fichier_path])

        if (storageError) {
          console.error("Erreur lors de la suppression du fichier:", storageError)
          // Continuer malgré l'erreur pour supprimer l'entrée de la base de données
        }
      }

      // Supprimer les notifications associées
      await supabaseAdmin.from("document_notifications").delete().eq("document_id", documentId)

      // Supprimer les partages associés
      await supabaseAdmin.from("document_partages").delete().eq("document_id", documentId)

      // Supprimer le document de la base de données
      const { error: deleteError } = await supabaseAdmin.from("documents").delete().eq("id", documentId)

      if (deleteError) {
        console.error("Erreur lors de la suppression du document:", deleteError)
        alert("Erreur lors de la suppression du document")
        return
      }

      // Rafraîchir la liste des documents
      fetchDocuments()
    } catch (err) {
      console.error("Exception lors de la suppression du document:", err)
      alert(`Erreur: ${err instanceof Error ? err.message : "Erreur inconnue"}`)
    }
  }

  const getDocumentUrl = async (documentPath: string) => {
    try {
      const { data, error } = await supabaseAdmin.storage.from("client-documents").createSignedUrl(documentPath, 60) // URL valide pendant 60 secondes

      if (error) {
        console.error("Erreur lors de la création de l'URL signée:", error)
        return null
      }

      return data.signedUrl
    } catch (err) {
      console.error("Exception lors de la création de l'URL signée:", err)
      return null
    }
  }

  const handleViewDocument = async (documentPath: string) => {
    const url = await getDocumentUrl(documentPath)
    if (url) {
      window.open(url, "_blank")
    } else {
      alert("Impossible d'accéder au document")
    }
  }

  const handleDownloadDocument = async (documentPath: string, documentName: string) => {
    const url = await getDocumentUrl(documentPath)
    if (url) {
      const a = document.createElement("a")
      a.href = url
      a.download = documentName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      alert("Impossible de télécharger le document")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>
      case "payé":
        return <Badge variant="success">Payé</Badge>
      case "signé":
        return <Badge variant="success">Signé</Badge>
      case "refusé":
        return <Badge variant="destructive">Refusé</Badge>
      case "expiré":
        return <Badge variant="outline">Expiré</Badge>
      case "brouillon":
        return <Badge variant="outline">Brouillon</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "facture":
        return <Badge className="bg-blue-500">Facture</Badge>
      case "devis":
        return <Badge className="bg-amber-500">Devis</Badge>
      case "contrat":
        return <Badge className="bg-green-500">Contrat</Badge>
      default:
        return <Badge className="bg-gray-500">Autre</Badge>
    }
  }

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Gestion des documents</h1>

      {!tableExists && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTitle>Table manquante</AlertTitle>
          <AlertDescription>
            La table "documents" n'existe pas dans la base de données. Veuillez exécuter le script d'initialisation.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debug && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
          <AlertTitle className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            Informations de débogage
          </AlertTitle>
          <AlertDescription>
            <pre className="mt-2 whitespace-pre-wrap text-xs">{JSON.stringify(debug, null, 2)}</pre>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                {tableExists
                  ? `${filteredDocuments.length} document(s) trouvé(s)`
                  : "La table 'documents' n'existe pas dans la base de données."}
              </CardDescription>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto" disabled={!tableExists || clients.length === 0}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Ajouter un document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau document</DialogTitle>
                  <DialogDescription>Téléchargez un document et associez-le à un client.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="client_id">Client</Label>
                      <Select
                        name="client_id"
                        value={formData.client_id}
                        onValueChange={(value) => handleSelectChange("client_id", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.nom_entreprise || client.nom} ({client.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="titre">Titre</Label>
                      <Input id="titre" name="titre" value={formData.titre} onChange={handleInputChange} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          name="type"
                          value={formData.type}
                          onValueChange={(value) => handleSelectChange("type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type de document" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facture">Facture</SelectItem>
                            <SelectItem value="devis">Devis</SelectItem>
                            <SelectItem value="contrat">Contrat</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="statut">Statut</Label>
                        <Select
                          name="statut"
                          value={formData.statut}
                          onValueChange={(value) => handleSelectChange("statut", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Statut du document" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="payé">Payé</SelectItem>
                            <SelectItem value="signé">Signé</SelectItem>
                            <SelectItem value="refusé">Refusé</SelectItem>
                            <SelectItem value="expiré">Expiré</SelectItem>
                            <SelectItem value="brouillon">Brouillon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="montant">Montant (€)</Label>
                      <Input
                        id="montant"
                        name="montant"
                        type="number"
                        step="0.01"
                        value={formData.montant}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="file">Fichier</Label>
                      <Input id="file" type="file" onChange={handleFileChange} required />
                      {selectedFile && (
                        <p className="text-xs text-gray-500">
                          {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                      )}
                    </div>
                  </div>
                  {uploadError && (
                    <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
                      <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                  )}
                  {uploadSuccess && (
                    <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                      <AlertDescription>Document téléchargé avec succès!</AlertDescription>
                    </Alert>
                  )}
                  <DialogFooter>
                    <Button type="submit" disabled={uploadLoading}>
                      {uploadLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Téléchargement...
                        </>
                      ) : (
                        "Télécharger"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un document..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedClient || "all"}
              onValueChange={(value) => setSelectedClient(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tous les clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nom_entreprise || client.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchDocuments} className="w-full sm:w-auto">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Actualiser"}
            </Button>
          </div>

          <Tabs defaultValue="tous" className="mb-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="facture">Factures</TabsTrigger>
              <TabsTrigger value="devis">Devis</TabsTrigger>
              <TabsTrigger value="contrat">Contrats</TabsTrigger>
              <TabsTrigger value="autre">Autres</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun document trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{document.titre}</TableCell>
                        <TableCell>
                          {document.clients?.nom_entreprise || document.clients?.nom || "Client inconnu"}
                        </TableCell>
                        <TableCell>{getTypeBadge(document.type)}</TableCell>
                        <TableCell>{getStatusBadge(document.statut)}</TableCell>
                        <TableCell>{formatDate(document.date_creation)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDocument(document.fichier_path)}
                              title="Voir"
                              disabled={!document.fichier_path}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadDocument(document.fichier_path, document.fichier_nom)}
                              title="Télécharger"
                              disabled={!document.fichier_path}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDocument(document.id)}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
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
            <CardTitle>Créer les tables nécessaires</CardTitle>
            <CardDescription>
              Exécutez le script SQL ci-dessous dans l'interface SQL de Supabase pour créer les tables nécessaires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-gray-900 p-4 text-sm text-gray-100">
              <pre className="whitespace-pre-wrap">
                {`-- Table des documents
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

-- Table des partages de documents
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

-- Table des notifications de documents
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

-- Créer un bucket de stockage pour les documents
-- Exécutez cette commande dans l'interface de Supabase Storage
-- CREATE BUCKET client_documents;`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
