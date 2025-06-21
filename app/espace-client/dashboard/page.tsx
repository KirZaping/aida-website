import { cookies } from "next/headers"
import Link from "next/link"
import {
  FileText, Clock, CheckCircle, AlertCircle,
} from "lucide-react"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"

import { getClientSession } from "@/app/actions/client-auth"
import {
  getClientProjects,
  getClientInvoices,
} from "@/app/actions/client-data"

import { getClientDocuments } from "@/app/actions/documents"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  if (!session) return null // le layout gère la redirection

  /* ---------------------- Fetch data ---------------------- */
  const { documents = [], error: documentsError } = await getClientDocuments(session.id)
  const { projects = [], error: projectsError }   = await getClientProjects(session.id)
  const { invoices = [], error: invoicesError }   = await getClientInvoices(session.id)

  /* ----------------------- Stats -------------------------- */
  const recentDocuments      = documents.slice(0, 3)
  const documentsCount       = documents.length
  const projectsInProgress   = projects.filter(p => p.statut === "en_cours").length
  const projectsCompleted    = projects.filter(p => p.statut === "terminé").length
  const pendingInvoicesCount = invoices.filter(i => i.statut === "en_attente").length

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------- */}
      {/* HEADER                                            */}
      {/* -------------------------------------------------- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace client, {session.entreprise}
        </p>
      </div>

      {/* -------------------------------------------------- */}
      {/* STAT CARDS (cliquables)                           */}
      {/* -------------------------------------------------- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Documents */}
        <Link href="/espace-client/documents" className="block focus:outline-none">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentsCount}</div>
              <p className="text-xs text-muted-foreground">Documents disponibles</p>
            </CardContent>
          </Card>
        </Link>

        {/* Projets en cours */}
        <Link href="/espace-client/info-contrat" className="block focus:outline-none">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projets en cours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsInProgress}</div>
              <p className="text-xs text-muted-foreground">Projets en développement</p>
            </CardContent>
          </Card>
        </Link>

        {/* Projets terminés */}
        <Link href="/espace-client/info-contrat" className="block focus:outline-none">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projets terminés</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsCompleted}</div>
              <p className="text-xs text-muted-foreground">Projets livrés</p>
            </CardContent>
          </Card>
        </Link>

        {/* Factures en attente */}
        <Link href="/espace-client/invoices" className="block focus:outline-none">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoicesCount}</div>
              <p className="text-xs text-muted-foreground">Factures à régler</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* -------------------------------------------------- */}
      {/* DOCUMENTS RÉCENTS                                 */}
      {/* -------------------------------------------------- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Documents récents</h2>

        {documentsError ? (
          <Card><CardContent className="pt-6">
            <p className="text-muted-foreground">
              Impossible de charger les documents. Veuillez réessayer plus tard.
            </p>
          </CardContent></Card>
        ) : recentDocuments.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recentDocuments.map(doc => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">{doc.titre || doc.nom}</CardTitle>
                  <CardDescription>
                    {new Date(doc.date_creation).toLocaleDateString("fr-FR")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    {doc.description?.substring(0, 100) || "Aucune description"}
                    {doc.description?.length > 100 && "…"}
                  </p>
                </CardContent>
                <div className="px-6 pb-4">
                  <Link
                    href={`/espace-client/documents/${doc.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Voir le document
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="pt-6">
            <p className="text-muted-foreground">Aucun document disponible pour le moment.</p>
          </CardContent></Card>
        )}

        {recentDocuments.length > 0 && (
          <div className="mt-4 text-right">
            <Link href="/espace-client/documents" className="text-sm text-primary hover:underline">
              Voir tous les documents →
            </Link>
          </div>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* PROJETS EN COURS                                  */}
      {/* -------------------------------------------------- */}
      <SectionProjects
        title="Projets en cours"
        emptyMsg="Aucun projet en cours pour le moment."
        projects={projects.filter(p => p.statut === "en_cours")}
        error={projectsError}
      />

      {/* -------------------------------------------------- */}
      {/* PROJETS TERMINÉS                                  */}
      {/* -------------------------------------------------- */}
      <SectionProjects
        title="Projets terminés"
        emptyMsg="Aucun projet terminé pour le moment."
        projects={projects.filter(p => p.statut === "terminé")}
        error={projectsError}
        finished
      />

      {/* -------------------------------------------------- */}
      {/* FACTURES EN ATTENTE                               */}
      {/* -------------------------------------------------- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Factures en attente</h2>
        {invoicesError ? (
          <Card><CardContent className="pt-6">
            <p className="text-muted-foreground">
              Impossible de charger les factures. Veuillez réessayer plus tard.
            </p>
          </CardContent></Card>
        ) : invoices.filter(i => i.statut === "en_attente").length ? (
          <div className="space-y-4">
            {invoices
              .filter(i => i.statut === "en_attente")
              .slice(0, 3)
              .map(invoice => (
                <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          Facture #{invoice.numero || invoice.id}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Émise le{" "}
                          {invoice.date_emission
                            ? new Date(invoice.date_emission)
                                .toLocaleDateString("fr-FR")
                            : "—"}
                        </p>
                      </div>
                      <div className="font-bold">
                        {invoice.montant != null
                          ? new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(invoice.montant)
                          : "—"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card><CardContent className="pt-6">
            <p className="text-muted-foreground">
              Aucune facture en attente pour le moment.
            </p>
          </CardContent></Card>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ */
/* -----------  Sous-composant : listes de projets  ------------ */
/* ------------------------------------------------------------ */
function SectionProjects({
  title,
  emptyMsg,
  projects,
  error,
  finished = false,
}: {
  title: string
  emptyMsg: string
  projects: any[]
  error: string | null | undefined
  finished?: boolean
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {error ? (
        <Card><CardContent className="pt-6">
          <p className="text-muted-foreground">
            Impossible de charger les projets. Veuillez réessayer plus tard.
          </p>
        </CardContent></Card>
      ) : projects.length ? (
        <div className="space-y-4">
          {projects.slice(0, 3).map(project => (
            <Link
              key={project.id}
              href={`/espace-client/info-contrat/${project.id}`}
              className="block focus:outline-none"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.nom}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.description?.substring(0, 150) || "Aucune description"}
                        {project.description?.length > 150 && "…"}
                      </p>
                    </div>
                    <div
                      className={
                        finished
                          ? "bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full"
                          : "bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      }
                    >
                      {finished ? "Terminé" : `${project.progression || 0}% terminé`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card><CardContent className="pt-6">
          <p className="text-muted-foreground">{emptyMsg}</p>
        </CardContent></Card>
      )}
    </div>
  )
}
