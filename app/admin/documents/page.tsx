"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Search, FileUp, Download, Eye, Trash2, FolderPlus } from "lucide-react"
import { supabaseAdmin, ensureClientFolder } from "@/lib/supabase"
import { formatDate, formatFileSize } from "@/lib/utils"

export default function DocumentsPage() {
  const searchParams = useSearchParams()
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

    // Vérifier si on doit ouvrir le modal d'ajout automatiquement
    const shouldOpenModal = searchParams.get("action") === "add"
    const clientId = searchParams.get("client_id")

    if (shouldOpenModal) {
      setUploadDialogOpen(true)
      if (clientId) {
        setFormData((prev) => ({ ...prev, client_id: clientId }))
      }
    }
  }, [searchParams])

  useEffect(() => {
    filterDocuments()
  }, [searchTerm, documents, activeTab, selectedClient])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      // Vérifier si la table documents existe
      const { error: tableError } = await supabaseAdmin.from("documents").select("count").limit(1)

      if (tableError) {
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
        setError(`Erreur: ${error.message}`)
        setDocuments([])
        setFilteredDocuments([])
        setLoading(false)
        return
      }

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
          }
        }
      }

      setDocuments(documentsWithClients)
      filterDocuments(documentsWithClients)
    } catch (err) {
      setError(`Une erreur est survenue lors du chargement des documents.`)
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
        setClients([])
        return
      }

      // Récupérer les clients
      const { data, error } = await supabaseAdmin
        .from("clients")
        .select("id, nom, email, nom_entreprise")
        .order("nom", { ascending: true })

      if (error) {
        setClients([])
      } else if (data) {
        setClients(data)
      }
    } catch (err) {
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

      // S'assurer que le dossier du client existe
      const folderCreated = await ensureClientFolder(formData.client_id)
      if (!folderCreated) {
        setUploadError("Impossible de créer le dossier du client")
        setUploadLoading(false)
        return
      }

      // Préparer le chemin du fichier dans le dossier du client
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${formData.client_id}/${fileName}`

      // Upload du fichier
      const { error: uploadError } = await supabaseAdmin.storage
        .from("client-documents")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        setUploadError(`Erreur lors du téléchargement: ${uploadError.message}`)
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
      setUploadError(`Une erreur est survenue lors du téléchargement`)
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
        alert("Erreur lors de la suppression du document")
        return
      }

      // Supprimer le fichier du stockage
      if (document.fichier_path) {
        await supabaseAdmin.storage.from("client-documents").remove([document.fichier_path])
      }

      // Supprimer les notifications associées
      await supabaseAdmin.from("document_notifications").delete().eq("document_id", documentId)

      // Supprimer les partages associés
      await supabaseAdmin.from("document_partages").delete().eq("document_id", documentId)

      // Supprimer le document de la base de données
      const { error: deleteError } = await supabaseAdmin.from("documents").delete().eq("id", documentId)

      if (deleteError) {
        alert("Erreur lors de la suppression du document")
        return
      }

      // Rafraîchir la liste des documents
      fetchDocuments()
    } catch (err) {
      alert(`Une erreur est survenue lors de la suppression`)
    }
  }

  const getDocumentUrl = async (documentPath: string) => {
    try {
      const { data, error } = await supabaseAdmin.storage.from("client-documents").createSignedUrl(documentPath, 60) // URL valide pendant 60 secondes

      if (error) {
        return null
      }

      return data.signedUrl
    } catch (err) {
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
        return <Badge className="bg-gray-200 text-gray-900">En attente</Badge>
      case "payé":
        return <Badge className="bg-blue-600 text-white">Payé</Badge>
      case "signé":
        return <Badge className="bg-blue-600 text-white">Signé</Badge>
      case "refusé":
        return <Badge className="bg-red-600 text-white">Refusé</Badge>
      case "expiré":
        return <Badge className="bg-white text-gray-700 border border-gray-300">Expiré</Badge>
      case "brouillon":
        return <Badge className="bg-white text-gray-700 border border-gray-300">Brouillon</Badge>
      default:
        return <Badge className="bg-gray-200 text-gray-900">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "facture":
        return <Badge className="bg-blue-500 text-white">Facture</Badge>
      case "devis":
        return <Badge className="bg-amber-500 text-white">Devis</Badge>
      case "contrat":
        return <Badge className="bg-green-500 text-white">Contrat</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Autre</Badge>
    }
  }

  // Fonction pour initialiser les dossiers clients
  const initializeClientFolders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Récupérer tous les clients
      const { data: clientsData, error: clientsError } = await supabaseAdmin
        .from("clients")
        .select("id")
        .order("id", { ascending: true })

      if (clientsError) {
        setError("Impossible de récupérer la liste des clients")
        setLoading(false)
        return
      }

      if (!clientsData || clientsData.length === 0) {
        setError("Aucun client trouvé")
        setLoading(false)
        return
      }

      // Créer un dossier pour chaque client
      let successCount = 0
      let errorCount = 0

      for (const client of clientsData) {
        const success = await ensureClientFolder(client.id)
        if (success) {
          successCount++
        } else {
          errorCount++
        }
      }

      alert(`Initialisation terminée: ${successCount} dossiers créés, ${errorCount} erreurs`)

      // Rafraîchir les données
      fetchDocuments()
    } catch (err) {
      setError(`Une erreur est survenue lors de l'initialisation des dossiers`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Gestion des documents</h1>

      {!tableExists && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertTitle className="text-amber-800">Table manquante</AlertTitle>
          <AlertDescription className="text-amber-700">
            La table "documents" n'existe pas dans la base de données. Veuillez exécuter le script d'initialisation.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 border-red-300 bg-red-50">
          <AlertTitle className="text-red-800">Erreur</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-gray-900">Documents</CardTitle>
              <CardDescription className="text-gray-600">
                {tableExists
                  ? `${filteredDocuments.length} document(s) trouvé(s)`
                  : "La table 'documents' n'existe pas dans la base de données."}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={initializeClientFolders}
                disabled={loading}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Initialiser les dossiers
              </Button>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                    disabled={!tableExists || clients.length === 0}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Ajouter un document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Ajouter un nouveau document</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Téléchargez un document et associez-le à un client.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="client_id" className="text-gray-900">
                          Client
                        </Label>
                        <Select
                          name="client_id"
                          value={formData.client_id}
                          onValueChange={(value) => handleSelectChange("client_id", value)}
                          required
                        >
                          <SelectTrigger className="border-gray-300">
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
                        <Label htmlFor="titre" className="text-gray-900">
                          Titre
                        </Label>
                        <Input
                          id="titre"
                          name="titre"
                          value={formData.titre}
                          onChange={handleInputChange}
                          required
                          className="border-gray-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description" className="text-gray-900">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="border-gray-300"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="type" className="text-gray-900">
                            Type
                          </Label>
                          <Select
                            name="type"
                            value={formData.type}
                            onValueChange={(value) => handleSelectChange("type", value)}
                          >
                            <SelectTrigger className="border-gray-300">
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
                          <Label htmlFor="statut" className="text-gray-900">
                            Statut
                          </Label>
                          <Select
                            name="statut"
                            value={formData.statut}
                            onValueChange={(value) => handleSelectChange("statut", value)}
                          >
                            <SelectTrigger className="border-gray-300">
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
                        <Label htmlFor="montant" className="text-gray-900">
                          Montant (€)
                        </Label>
                        <Input
                          id="montant"
                          name="montant"
                          type="number"
                          step="0.01"
                          value={formData.montant}
                          onChange={handleInputChange}
                          className="border-gray-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="file" className="text-gray-900">
                          Fichier
                        </Label>
                        <Input id="file" type="file" onChange={handleFileChange} required className="border-gray-300" />
                        {selectedFile && (
                          <p className="text-xs text-gray-500">
                            {selectedFile.name} ({formatFileSize(selectedFile.size)})
                          </p>
                        )}
                      </div>
                    </div>
                    {uploadError && (
                      <Alert className="mb-4 border-red-300 bg-red-50">
                        <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
                      </Alert>
                    )}
                    {uploadSuccess && (
                      <Alert className="mb-4 border-green-300 bg-green-50">
                        <AlertDescription className="text-green-700">Document téléchargé avec succès!</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={uploadLoading}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {uploadLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Téléchargement...
                          </>
                        ) : (
                          "Télécharger"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un document..."
                className="pl-8 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedClient || "all"}
              onValueChange={(value) => setSelectedClient(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[200px] border-gray-300">
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
            <Button
              variant="outline"
              onClick={fetchDocuments}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Actualiser"}
            </Button>
          </div>

          <Tabs defaultValue="tous" className="mb-4" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger
                value="tous"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Tous
              </TabsTrigger>
              <TabsTrigger
                value="facture"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Factures
              </TabsTrigger>
              <TabsTrigger
                value="devis"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Devis
              </TabsTrigger>
              <TabsTrigger
                value="contrat"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Contrats
              </TabsTrigger>
              <TabsTrigger
                value="autre"
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Autres
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="rounded-md border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-900">Titre</TableHead>
                    <TableHead className="text-gray-900">Client</TableHead>
                    <TableHead className="text-gray-900">Type</TableHead>
                    <TableHead className="text-gray-900">Statut</TableHead>
                    <TableHead className="text-gray-900">Date</TableHead>
                    <TableHead className="text-right text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-600">
                        Aucun document trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{document.titre}</TableCell>
                        <TableCell className="text-gray-600">
                          {document.clients?.nom_entreprise || document.clients?.nom || "Client inconnu"}
                        </TableCell>
                        <TableCell>{getTypeBadge(document.type)}</TableCell>
                        <TableCell>{getStatusBadge(document.statut)}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(document.date_creation)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDocument(document.fichier_path)}
                              title="Voir"
                              disabled={!document.fichier_path}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadDocument(document.fichier_path, document.fichier_nom)}
                              title="Télécharger"
                              disabled={!document.fichier_path}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDocument(document.id)}
                              title="Supprimer"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
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
        <Card className="mt-6 bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Créer les tables nécessaires</CardTitle>
            <CardDescription className="text-gray-600">
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
);`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
