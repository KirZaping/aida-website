"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Edit, FileText, Folder, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { getClient, getClientDocuments, getClientProjects } from "../../actions/clients"
import { formatDate } from "@/lib/utils"

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [clientId, setClientId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Résoudre les params de manière asynchrone
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params
        setClientId(resolvedParams.id)
      } catch (err) {
        console.error("Erreur lors de la résolution des params:", err)
        setError("Erreur lors du chargement de la page")
        setLoading(false)
      }
    }

    resolveParams()
  }, [params])

  // Charger les données du client une fois l'ID résolu
  useEffect(() => {
    if (clientId) {
      fetchClientData()
    }
  }, [clientId])

  const fetchClientData = async () => {
    if (!clientId) return

    try {
      setLoading(true)
      setError(null)

      // Récupérer les informations du client
      const clientResult = await getClient(clientId)
      if (clientResult.error) {
        setError(clientResult.error)
        return
      }
      setClient(clientResult.client)

      // Récupérer les documents du client
      const documentsResult = await getClientDocuments(clientId)
      if (documentsResult.error) {
        console.error("Erreur lors de la récupération des documents:", documentsResult.error)
      } else {
        setDocuments(documentsResult.documents || [])
      }

      // Récupérer les projets du client
      const projectsResult = await getClientProjects(clientId)
      if (projectsResult.error) {
        console.error("Erreur lors de la récupération des projets:", projectsResult.error)
      } else {
        setProjects(projectsResult.projects || [])
      }
    } catch (err) {
      console.error("Exception lors de la récupération des données du client:", err)
      setError(`Une erreur est survenue: ${err instanceof Error ? err.message : "Erreur inconnue"}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl p-6">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-7xl p-6">
        <Alert className="mb-6 border-red-300 bg-red-50">
          <AlertTitle className="text-red-800">Erreur</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="container max-w-7xl p-6">
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertTitle className="text-amber-800">Client introuvable</AlertTitle>
          <AlertDescription className="text-amber-700">
            Le client demandé n'existe pas ou a été supprimé.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/clients")}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste des clients
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {client.prenom} {client.nom}
          </h1>
          <Badge
            className={
              client.type === "client"
                ? "bg-blue-600 text-white"
                : client.type === "prospect"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-white text-gray-700 border border-gray-300"
            }
          >
            {client.type === "client" ? "Client" : client.type === "prospect" ? "Prospect" : "Partenaire"}
          </Badge>
        </div>
        <Button
          onClick={() => router.push(`/admin/clients/${clientId}/modifier`)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">Informations</CardTitle>
            <CardDescription className="text-gray-600">Détails du client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{client.email}</p>
              </div>
            </div>
            {client.telephone && (
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Téléphone</p>
                  <p className="text-sm text-gray-600">{client.telephone}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Entreprise</p>
                <p className="text-sm text-gray-600">{client.entreprise}</p>
              </div>
            </div>
            {(client.adresse || client.code_postal || client.ville) && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Adresse</p>
                  <p className="text-sm text-gray-600">
                    {client.adresse && (
                      <span>
                        {client.adresse}
                        <br />
                      </span>
                    )}
                    {client.code_postal && client.ville && (
                      <span>
                        {client.code_postal} {client.ville}
                        <br />
                      </span>
                    )}
                    {client.pays && <span>{client.pays}</span>}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Date de création</p>
                <p className="text-sm text-gray-600">{formatDate(client.date_creation)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
              <Link href={`mailto:${client.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer un email
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">Activité</CardTitle>
            <CardDescription className="text-gray-600">Documents et projets du client</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="documents">
              <TabsList className="mb-4 bg-gray-100">
                <TabsTrigger
                  value="documents"
                  className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Documents ({documents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Projets ({projects.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="documents">
                {documents.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-8 text-center">
                    <FileText className="mb-2 h-8 w-8 text-gray-400" />
                    <h3 className="mb-1 text-lg font-medium text-gray-900">Aucun document</h3>
                    <p className="text-sm text-gray-600">Ce client n'a pas encore de documents.</p>
                    <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700" asChild>
                      <Link href="/admin/documents">Ajouter un document</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-gray-900">Titre</TableHead>
                          <TableHead className="text-gray-900">Type</TableHead>
                          <TableHead className="text-gray-900">Statut</TableHead>
                          <TableHead className="text-gray-900">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc) => (
                          <TableRow key={doc.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">{doc.titre}</TableCell>
                            <TableCell>
                              <Badge className="bg-white text-gray-700 border border-gray-300">
                                {doc.type === "facture"
                                  ? "Facture"
                                  : doc.type === "devis"
                                    ? "Devis"
                                    : doc.type === "contrat"
                                      ? "Contrat"
                                      : "Autre"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  doc.statut === "payé" || doc.statut === "signé"
                                    ? "bg-blue-600 text-white"
                                    : doc.statut === "en_attente"
                                      ? "bg-gray-200 text-gray-900"
                                      : doc.statut === "refusé" || doc.statut === "expiré"
                                        ? "bg-red-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300"
                                }
                              >
                                {doc.statut === "en_attente"
                                  ? "En attente"
                                  : doc.statut === "payé"
                                    ? "Payé"
                                    : doc.statut === "signé"
                                      ? "Signé"
                                      : doc.statut === "refusé"
                                        ? "Refusé"
                                        : doc.statut === "expiré"
                                          ? "Expiré"
                                          : doc.statut === "brouillon"
                                            ? "Brouillon"
                                            : doc.statut}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{formatDate(doc.date_creation)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="projects">
                {projects.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-8 text-center">
                    <Folder className="mb-2 h-8 w-8 text-gray-400" />
                    <h3 className="mb-1 text-lg font-medium text-gray-900">Aucun projet</h3>
                    <p className="text-sm text-gray-600">Ce client n'a pas encore de projets.</p>
                    <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">Ajouter un projet</Button>
                  </div>
                ) : (
                  <div className="rounded-md border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-gray-900">Nom</TableHead>
                          <TableHead className="text-gray-900">Statut</TableHead>
                          <TableHead className="text-gray-900">Progression</TableHead>
                          <TableHead className="text-gray-900">Date de début</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">{project.nom}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  project.statut === "terminé"
                                    ? "bg-blue-600 text-white"
                                    : project.statut === "en_cours"
                                      ? "bg-gray-200 text-gray-900"
                                      : project.statut === "annulé"
                                        ? "bg-red-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300"
                                }
                              >
                                {project.statut === "en_cours"
                                  ? "En cours"
                                  : project.statut === "terminé"
                                    ? "Terminé"
                                    : project.statut === "annulé"
                                      ? "Annulé"
                                      : project.statut === "en_pause"
                                        ? "En pause"
                                        : project.statut}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                  <div
                                    className="h-2 rounded-full bg-blue-600"
                                    style={{ width: `${project.progression}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-700">{project.progression}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{formatDate(project.date_debut)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
