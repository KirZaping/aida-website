import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Calendar, Building, ClipboardList } from "lucide-react"
import Link from "next/link"

import { getClientSession } from "@/app/actions/client-auth"
import { supabaseAdmin } from "@/lib/supabase"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function InfoContratPage() {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)
  if (!session) {
    redirect("/espace-client/login")
  }

  const { data: projets, error: projetsError } = await supabaseAdmin
    .from("projets")
    .select(`
      id,
      nom,
      description,
      statut,
      progression,
      date_debut,
      date_fin,
      date_creation
    `)
    .eq("client_id", session.id)
    .order("date_creation", { ascending: false })

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────── 
          En-tête de la page 
      ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Info Contrat</h1>
          <p className="text-muted-foreground">
            Liste des projets/contrats pour :{" "}
            <span className="font-medium">{session.entreprise}</span>
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────── 
          Gestion des erreurs / affichage de la liste 
      ─────────────────────────────────────────────────── */}
      {projetsError ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Impossible de charger les informations des projets. Veuillez réessayer plus tard.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {projets && projets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {projets.map((projet) => (
                <Card key={projet.id}>
                  <CardHeader>
                    <CardTitle>{projet.nom}</CardTitle>
                    <CardDescription>
                      Créé le{" "}
                      {projet.date_creation
                        ? new Date(projet.date_creation).toLocaleDateString("fr-FR")
                        : "—"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Description du projet */}
                    {projet.description && (
                      <div>
                        <p className="text-sm font-medium">Description</p>
                        <p className="text-sm text-muted-foreground">
                          {projet.description}
                        </p>
                      </div>
                    )}

                    {/* Statut */}
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Statut</p>
                        <p className="text-sm text-muted-foreground">
                          {projet.statut ?? "Non renseigné"}
                        </p>
                      </div>
                    </div>

                    {/* Progression */}
                    {typeof projet.progression === "number" && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Progression (%)</p>
                          <p className="text-sm text-muted-foreground">
                            {projet.progression} %
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dates de début et fin */}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date de début</p>
                        <p className="text-sm text-muted-foreground">
                          {projet.date_debut
                            ? new Date(projet.date_debut).toLocaleDateString("fr-FR")
                            : "Non renseignée"}
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
                            : "Non renseignée"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Aucun projet/contrat trouvé pour le moment.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
