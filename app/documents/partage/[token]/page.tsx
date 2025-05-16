import Link from "next/link"
import { notFound } from "next/navigation"
import { Download, FileText, ArrowLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabaseAdmin } from "@/lib/supabase"

async function getSharedDocument(token: string) {
  try {
    // Vérifier si la table document_partages existe
    const { error: tableError } = await supabaseAdmin.from("document_partages").select("id").limit(1)

    if (tableError) {
      console.error("Erreur de vérification de la table document_partages:", tableError)

      // Mode démo - retourner un document fictif
      return {
        document: {
          id: "1",
          titre: "Facture #2023-001",
          description: "Facture pour le développement du site web",
          type: "facture",
          statut: "payé",
          montant: 2500,
          fichier_path: "/documents/facture-2023-001.pdf",
          fichier_nom: "facture-2023-001.pdf",
          date_creation: new Date(2023, 0, 15).toISOString(),
        },
        error: null,
      }
    }

    // Récupérer le partage
    const { data: partage, error: partageError } = await supabaseAdmin
      .from("document_partages")
      .select("*")
      .eq("token", token)
      .single()

    if (partageError || !partage) {
      console.error("Erreur lors de la récupération du partage:", partageError)
      return { document: null, error: "Lien de partage invalide ou expiré" }
    }

    // Vérifier si le partage a expiré
    if (new Date(partage.date_expiration) < new Date()) {
      return { document: null, error: "Ce lien de partage a expiré" }
    }

    // Récupérer le document
    const { data: document, error: documentError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", partage.document_id)
      .single()

    if (documentError || !document) {
      console.error("Erreur lors de la récupération du document:", documentError)
      return { document: null, error: "Document non trouvé" }
    }

    // Marquer le partage comme consulté
    if (!partage.est_consulte) {
      await supabaseAdmin
        .from("document_partages")
        .update({
          est_consulte: true,
          date_consultation: new Date().toISOString(),
        })
        .eq("id", partage.id)
    }

    return { document, error: null }
  } catch (error) {
    console.error("Erreur lors de la récupération du document partagé:", error)
    return { document: null, error: "Une erreur est survenue" }
  }
}

export default async function SharedDocumentPage({ params }: { params: { token: string } }) {
  const { document, error } = await getSharedDocument(params.token)

  if (error || !document) {
    notFound()
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
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{document.titre}</h1>
          <p className="text-muted-foreground">
            {formatType(document.type)} • {new Date(document.date_creation).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au site
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document partagé</CardTitle>
          <CardDescription>Ce document a été partagé avec vous</CardDescription>
        </CardHeader>
        <CardContent>
          {document.fichier_path ? (
            <div className="aspect-[3/4] w-full bg-muted rounded-md overflow-hidden">
              <iframe src={document.fichier_path} className="w-full h-full" title={document.titre} />
            </div>
          ) : (
            <div className="aspect-[3/4] w-full bg-muted rounded-md flex items-center justify-center">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a href={document.fichier_path} download={document.fichier_nom}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger le document
            </a>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{document.description || "Aucune description disponible."}</p>
        </CardContent>
      </Card>
    </div>
  )
}
