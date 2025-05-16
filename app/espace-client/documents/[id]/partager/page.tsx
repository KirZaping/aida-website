import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Copy, Share2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getClientSession } from "@/app/actions/client-auth"
import { getDocument, createDocumentShareLink } from "@/app/actions/documents"
import { ShareDocumentForm } from "../../../components/share-document-form"

export default async function ShareDocumentPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  if (!session) {
    return null // Le layout redirigera vers la page de connexion
  }

  // Récupérer le document
  const { document, error } = await getDocument(params.id)

  if (error || !document) {
    notFound()
  }

  // Créer un lien de partage (valide 7 jours)
  const { url: shareUrl, error: shareError } = await createDocumentShareLink(params.id, 7)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Partager le document</h1>
          <p className="text-muted-foreground">{document.titre}</p>
        </div>
        <Link href={`/espace-client/documents/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au document
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lien de partage</CardTitle>
            <CardDescription>
              Ce lien permet à n'importe qui de consulter le document sans connexion. Il est valide pendant 7 jours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shareUrl ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input readOnly value={shareUrl} className="font-mono text-xs" />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copier le lien</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ce lien expirera le {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")}.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {shareError || "Impossible de générer un lien de partage. Veuillez réessayer."}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Partager sur les réseaux sociaux
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envoyer par email</CardTitle>
            <CardDescription>Envoyez le document directement par email à un destinataire.</CardDescription>
          </CardHeader>
          <CardContent>
            <ShareDocumentForm documentId={params.id} documentTitle={document.titre} shareUrl={shareUrl} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
