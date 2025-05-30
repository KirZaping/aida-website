import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Download, Share2, FileText, Clock, Euro } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getClientSession } from "@/app/actions/client-auth"
import { getDocument, markDocumentAsRead, getDocumentUrl } from "@/app/actions/documents"

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  if (!session) {
    return null // Le layout redirigera vers la page de connexion
  }

  // Récupérer le document
  const { document, error } = await getDocument(params.id)

  // Marquer le document comme lu
  await markDocumentAsRead(params.id)

  if (error || !document) {
    notFound()
  }

  // Obtenir l'URL signée du document pour l'affichage
  const documentUrl = document.fichier_path ? await getDocumentUrl(document.fichier_path) : null

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

  // Fonction pour formater le type de document
  const formatType = (type: string) => {
    switch (type) {
      case "facture":
        return "Facture"
      case "devis":
        return "Devis"
      case "contrat":
        return "Contrat"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{document.titre}</h1>
          <p className="text-muted-foreground">
            {formatType(document.type)} • {new Date(document.date_creation).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <Link href="/espace-client/documents">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux documents
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Aperçu du document</CardTitle>
            <CardDescription>Consultez le contenu du document</CardDescription>
          </CardHeader>
          <CardContent>
            {documentUrl ? (
              <div className="aspect-[3/4] w-full bg-muted rounded-md overflow-hidden">
                <iframe src={documentUrl} className="w-full h-full" title={document.titre} />
              </div>
            ) : (
              <div className="aspect-[3/4] w-full bg-muted rounded-md flex items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild disabled={!documentUrl}>
              <a href={documentUrl || "#"} download={document.fichier_nom}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/espace-client/documents/${document.id}/partager`}>
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Statut</p>
                <Badge className={getStatusColor(document.statut)}>{formatStatus(document.statut)}</Badge>
              </div>

              {document.montant && (
                <div>
                  <p className="text-sm font-medium">Montant</p>
                  <p className="flex items-center text-lg font-semibold">
                    <Euro className="mr-1 h-4 w-4" />
                    {document.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium">Date de création</p>
                <p className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(document.date_creation).toLocaleDateString("fr-FR")}
                </p>
              </div>

              {document.date_modification && document.date_modification !== document.date_creation && (
                <div>
                  <p className="text-sm font-medium">Dernière modification</p>
                  <p className="flex items-center text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    {new Date(document.date_modification).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{document.description || "Aucune description disponible."}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
