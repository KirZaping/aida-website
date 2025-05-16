import { cookies } from "next/headers"
import Link from "next/link"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientSession } from "@/app/actions/client-auth"
import { getClientDocuments } from "@/app/actions/documents"
import { getClientProjects, getClientInvoices } from "@/app/actions/client-data"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  if (!session) {
    return null // Le layout redirigera vers la page de connexion
  }

  // Récupérer les données du client
  const { documents, error: documentsError } = await getClientDocuments(session.id)
  const { projects, error: projectsError } = await getClientProjects(session.id)
  const { invoices, error: invoicesError } = await getClientInvoices(session.id)

  // Calculer les statistiques
  const recentDocuments = documents?.slice(0, 3) || []
  const documentsCount = documents?.length || 0
  const projectsInProgress = projects?.filter((p) => p.statut === "en_cours")?.length || 0
  const projectsCompleted = projects?.filter((p) => p.statut === "terminé")?.length || 0
  const pendingInvoices = invoices?.filter((i) => i.statut === "en_attente")?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace client, {session.entreprise}</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentsCount}</div>
            <p className="text-xs text-muted-foreground">Documents disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets en cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsInProgress}</div>
            <p className="text-xs text-muted-foreground">Projets en développement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsCompleted}</div>
            <p className="text-xs text-muted-foreground">Projets livrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">Factures à régler</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents récents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Documents récents</h2>
        {documentsError ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Impossible de charger les documents. Veuillez réessayer plus tard.
              </p>
            </CardContent>
          </Card>
        ) : recentDocuments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recentDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">{doc.titre || doc.nom}</CardTitle>
                  <CardDescription>{new Date(doc.date_creation).toLocaleDateString("fr-FR")}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    {doc.description?.substring(0, 100) || "Aucune description"}
                    {doc.description?.length > 100 ? "..." : ""}
                  </p>
                </CardContent>
                <div className="px-6 pb-4">
                  <Link href={`/espace-client/documents/${doc.id}`} className="text-sm text-primary hover:underline">
                    Voir le document
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Aucun document disponible pour le moment.</p>
            </CardContent>
          </Card>
        )}
        {recentDocuments.length > 0 && (
          <div className="mt-4 text-right">
            <Link href="/espace-client/documents" className="text-sm text-primary hover:underline">
              Voir tous les documents →
            </Link>
          </div>
        )}
      </div>

      {/* Projets en cours */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Projets en cours</h2>
        {projectsError ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Impossible de charger les projets. Veuillez réessayer plus tard.</p>
            </CardContent>
          </Card>
        ) : projects && projects.filter((p) => p.statut === "en_cours").length > 0 ? (
          <div className="space-y-4">
            {projects
              .filter((p) => p.statut === "en_cours")
              .slice(0, 3)
              .map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{project.nom}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.description?.substring(0, 150) || "Aucune description"}
                          {project.description?.length > 150 ? "..." : ""}
                        </p>
                      </div>
                      <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {project.progression || 0}% terminé
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Aucun projet en cours pour le moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
