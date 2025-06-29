"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Download, FileText, Search } from "lucide-react"
import clsx from "clsx"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export type DocumentDto = {
  id: string
  titre: string
  description?: string
  date_creation: string
  type: string
  statut: string
  fichier_nom: string
  fichier_path: string
}

type Props = {
  documents: DocumentDto[]
  error?: string | null
}

export default function DocumentBrowser({ documents, error }: Props) {
  /* ----------------------- Recherche ----------------------- */
  const [query, setQuery] = useState("")

  /* --------------------- Filtres statut -------------------- */
  const allStatuses = [
    "en_attente",
    "payé",
    "signé",
    "refusé",
    "expiré",
    "brouillon",
  ] as const

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const toggleStatus = (status: string) =>
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )

  /* ---------------- Filtrage documents --------------------- */
  const processedDocs = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = !q
      ? documents
      : documents.filter((d) =>
          d.titre.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          new Date(d.date_creation).toLocaleDateString("fr-FR").includes(q),
        )

    if (selectedStatuses.length > 0) {
      arr = arr.filter((d) => selectedStatuses.includes(d.statut))
    }

    return arr
  }, [documents, query, selectedStatuses])

  /* ---------------- Regroupement par type ------------------ */
  const documentsByType = useMemo(() => {
    const map: Record<string, DocumentDto[]> = {}
    processedDocs.forEach((doc) => {
      if (!map[doc.type]) map[doc.type] = []
      map[doc.type].push(doc)
    })
    return map
  }, [processedDocs])

  /* ----------------------- Helpers ------------------------- */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "payé":
        return "bg-green-100 text-green-800 border-green-200"
      case "signé":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "refusé":
        return "bg-red-100 text-red-800 border-red-200"
      case "expiré":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "en_attente":
        return "En attente"
      case "payé":
        return "Payé"
      case "signé":
        return "Signé"
      case "refusé":
        return "Refusé"
      case "expiré":
        return "Expiré"
      case "brouillon":
        return "Brouillon"
      default:
        return status
    }
  }

  /* ----------------------- Rendu --------------------------- */
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Consultez, téléchargez ou recherchez vos documents
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un document…"
          className="w-full pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Onglets par type + filtres statut juste en dessous */}
      <Tabs defaultValue="tous" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tous">Tous</TabsTrigger>
          {Object.keys(documentsByType).map((type) => (
            <TabsTrigger key={type} value={type}>
              {type === "facture"
                ? "Factures"
                : type === "contrat"
                  ? "Contrats"
                  : type === "devis"
                    ? "Devis"
                    : type}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Filtres statut — petits boutons */}
        <div className="flex flex-wrap gap-1 mt-2">
          {allStatuses.map((status) => {
            const selected = selectedStatuses.includes(status)
            return (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className={clsx(
                  "h-6 px-2 text-xs border",
                  selected
                    ? getStatusColor(status)
                    : "text-muted-foreground border-muted-foreground/20",
                )}
                onClick={() => toggleStatus(status)}
              >
                {formatStatus(status)}
              </Button>
            )
          })}
        </div>

        {/* Contenu : tous */}
        <TabsContent value="tous">
          <DocumentGrid
            docs={processedDocs}
            getStatusColor={getStatusColor}
            formatStatus={formatStatus}
          />
        </TabsContent>

        {/* Contenu : par type */}
        {Object.entries(documentsByType).map(([type, docs]) => (
          <TabsContent key={type} value={type}>
            <DocumentGrid
              docs={docs}
              getStatusColor={getStatusColor}
              formatStatus={formatStatus}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Gestion des erreurs / vide */}
      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Impossible de charger les documents. Veuillez réessayer plus tard.
            </p>
            <p className="text-muted-foreground text-sm mt-2">{error}</p>
          </CardContent>
        </Card>
      ) : processedDocs.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Aucun document ne correspond à votre recherche / filtre.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/* --------------------- Sous-composants --------------------- */
function DocumentGrid({
  docs,
  getStatusColor,
  formatStatus,
}: {
  docs: DocumentDto[]
  getStatusColor: (s: string) => string
  formatStatus: (s: string) => string
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
        />
      ))}
    </div>
  )
}

function DocumentCard({
  document,
  getStatusColor,
  formatStatus,
}: {
  document: DocumentDto
  getStatusColor: (s: string) => string
  formatStatus: (s: string) => string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md">{document.titre}</CardTitle>
          <Badge className={getStatusColor(document.statut)}>
            {formatStatus(document.statut)}
          </Badge>
        </div>
        <CardDescription>
          {new Date(document.date_creation).toLocaleDateString("fr-FR")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {document.description?.substring(0, 100)}
          {document.description && document.description.length > 100 && "…"}
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/espace-client/documents/${document.id}`}>
              <FileText className="h-4 w-4 mr-1" />
              Consulter
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={document.fichier_path} download={document.fichier_nom}>
              <Download className="h-4 w-4 mr-1" />
              Télécharger
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
