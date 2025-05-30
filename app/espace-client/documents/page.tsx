import { cookies } from "next/headers"
import Link from "next/link"
import { Download, FileText, Search } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { getClientSession } from "@/app/actions/client-auth"
import { getClientDocuments } from "@/app/actions/documents"

export default async function DocumentsPage() {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  if (!session) {
    return null // Le layout redirigera vers la page de connexion
  }

  // Récupérer les documents du client
  const { documents, error } = await getClientDocuments(session.id)

  // Fonction pour obtenir la couleur du badge en fonction du statut
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

  // Fonction pour formater le statut
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

  // Grouper les documents par type
  const documentsByType: Record<string, any[]> = {}

  documents?.forEach((doc) => {
    if (!documentsByType[doc.type]) {
      documentsByType[doc.type] = []
    }
    documentsByType[doc.type].push(doc)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">Consultez et téléchargez vos documents</p>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Rechercher un document..." className="w-full pl-8" />
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Impossible de charger les documents. Veuillez réessayer plus tard.</p>
            <p className="text-muted-foreground text-sm mt-2">{error}</p>
          </CardContent>
        </Card>
      ) : documents && documents.length > 0 ? (
        <Tabs defaultValue="tous" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tous">Tous</TabsTrigger>
            {Object.keys(documentsByType).map((type) => (
              <TabsTrigger key={type} value={type}>
                {type === "facture" ? "Factures" : type === "contrat" ? "Contrats" : type === "devis" ? "Devis" : type}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="tous">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} getStatusColor={getStatusColor} formatStatus={formatStatus} />
              ))}
            </div>
          </TabsContent>

          {Object.entries(documentsByType).map(([type, docs]) => (
            <TabsContent key={type} value={type}>
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
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Aucun document disponible pour le moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DocumentCard({
  document,
  getStatusColor,
  formatStatus,
}: {
  document: any
  getStatusColor: (status: string) => string
  formatStatus: (status: string) => string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md">{document.titre}</CardTitle>
          <Badge className={getStatusColor(document.statut)}>{formatStatus(document.statut)}</Badge>
        </div>
        <CardDescription>{new Date(document.date_creation).toLocaleDateString("fr-FR")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {document.description?.substring(0, 100)}
          {document.description?.length > 100 ? "..." : ""}
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
