// app/espace-client/documents/[id]/page.tsx
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Download, FileText, Clock, Euro, Copy, Share2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getClientSession } from "@/app/actions/client-auth"
import {
  getDocument,
  markDocumentAsRead,
  getDocumentUrl,
  createDocumentShareLink,
} from "@/app/actions/documents"

interface PageProps {
  params: { id: string }
  searchParams?: { download?: string }
}

export default async function DocumentPage({
  params,
  searchParams = {},
}: PageProps) {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)
  if (!session) return null

  // Récupérer et marquer lu
  const { document, error } = await getDocument(params.id)
  await markDocumentAsRead(params.id)

  if (error || !document) {
    notFound()
  }

  // Générer l'URL signée pour affichage
  const documentUrl = document.fichier_path
    ? await getDocumentUrl(document.fichier_path)
    : null

  // Si on a demandé le téléchargement, on redirige vers le document brut
  if (searchParams.download === "true" && documentUrl) {
    return redirect(documentUrl)
  }

  // Générer le lien de partage (valide 7 jours)
  const { url: shareUrl, error: shareError } =
    await createDocumentShareLink(params.id, 7)

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
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{document.titre}</h1>
          <p className="text-muted-foreground">
            {formatType(document.type)} •{" "}
            {new Date(document.date_creation).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/espace-client/documents">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux documents
            </Button>
          </Link>
          <Button
            variant="outline"
            asChild
            size="sm"
            disabled={!documentUrl}
          >
            <Link
              href={{
                pathname: `/espace-client/documents/${document.id}`,
                query: { download: "true" },
              }}
              prefetch={false}
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Aperçu */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Aperçu du document</CardTitle>
            <CardDescription>Consultez le contenu du document</CardDescription>
          </CardHeader>
          <CardContent>
            {documentUrl ? (
              <div className="aspect-[3/4] w-full bg-muted rounded-md overflow-hidden">
                <iframe
                  src={documentUrl}
                  className="w-full h-full"
                  title={document.titre}
                />
              </div>
            ) : (
              <div className="aspect-[3/4] w-full bg-muted rounded-md flex items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations, description et partage */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Statut</p>
                <Badge className={getStatusColor(document.statut)}>
                  {formatStatus(document.statut)}
                </Badge>
              </div>
              {document.montant && (
                <div>
                  <p className="text-sm font-medium">Montant</p>
                  <p className="flex items-center text-lg font-semibold">
                    <Euro className="mr-1 h-4 w-4" />
                    {document.montant.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
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
              {document.date_modification &&
                document.date_modification !== document.date_creation && (
                  <div>
                    <p className="text-sm font-medium">Dernière modification</p>
                    <p className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4" />
                      {new Date(
                        document.date_modification
                      ).toLocaleDateString("fr-FR")}
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
              <p className="text-sm">
                {document.description ||
                  "Aucune description disponible."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partage</CardTitle>
              <CardDescription>
                Copiez le lien ci-dessous pour partager ce document (valable 7 jours)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shareUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={shareUrl}
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copier le lien</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expire le{" "}
                    {new Date(
                      Date.now() + 7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {shareError ||
                    "Impossible de générer un lien de partage. Veuillez réessayer plus tard."}
                </p>
              )}
            </CardContent>
            
          </Card>
        </div>
      </div>
    </div>
  )
}
