import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { Calendar, Building, ClipboardList, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { getClientSession } from "@/app/actions/client-auth"
import { supabaseAdmin } from "@/lib/supabase"

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function ProjetDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const cookieStore = await cookies()
  const session = await getClientSession(cookieStore)
  if (!session) redirect("/espace-client/login")

  /* ----- Récupération du projet ----- */
  const { data: projet, error } = await supabaseAdmin
    .from("projets")
    .select(`
      id, nom, description, statut, progression,
      date_debut, date_fin, date_creation
    `)
    .eq("id", params.id)
    .eq("client_id", session.id) // sécurité : le projet doit appartenir au client
    .single()

  if (error || !projet) notFound()

  /* ---------- Rendu ---------- */
  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <Button variant="link" asChild className="px-0">
        <Link href="/espace-client/info-contrat" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour à la liste
        </Link>
      </Button>

      {/* Carte détaillée */}
      <Card>
        <CardHeader>
          <CardTitle>{projet.nom}</CardTitle>
          <CardDescription>
            Créé le&nbsp;
            {new Date(projet.date_creation).toLocaleDateString("fr-FR")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {projet.description && (
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {projet.description}
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Statut</p>
              <p className="text-sm text-muted-foreground">
                {projet.statut ?? "—"}
              </p>
            </div>
          </div>

          {typeof projet.progression === "number" && (
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Progression</p>
                <p className="text-sm text-muted-foreground">
                  {projet.progression} %
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date de début</p>
              <p className="text-sm text-muted-foreground">
                {projet.date_debut
                  ? new Date(projet.date_debut).toLocaleDateString("fr-FR")
                  : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date de fin</p>
              <p className="text-sm text-muted-foreground">
                {projet.date_fin
                  ? new Date(projet.date_fin).toLocaleDateString("fr-FR")
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
