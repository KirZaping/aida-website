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

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClientData()
  }, [params.id])

  const fetchClientData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Récupérer les informations du client
      const clientResult = await getClient(params.id)
      if (clientResult.error) {
        setError(clientResult.error)
        return
      }
      setClient(clientResult.client)

      // Récupérer les documents du client
      const documentsResult = await getClientDocuments(params.id)
      if (documentsResult.error) {
        console.error("Erreur lors de la récupération des documents:", documentsResult.error)
      } else {
        setDocuments(documentsResult.documents || [])
      }

      // Récupérer les projets du client
      const projectsResult = await getClientProjects(params.id)
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
        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="container max-w-7xl p-6">
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTitle>Client introuvable</AlertTitle>
          <AlertDescription>Le client demandé n'existe pas ou a été supprimé.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push("/admin/clients")}>
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
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">
            {client.prenom} {client.nom}
          </h1>
          <Badge variant={client.type === "client" ? "default" : client.type === "prospect" ? "secondary" : "outline"}>
            {client.type === "client" ? "Client" : client.type === "prospect" ? "Prospect" : "Partenaire"}
          </Badge>
        </div>
        <Button onClick={() => router.push(`/admin/clients/${params.id}/modifier`)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Détails du client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            {client.telephone && (
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-sm text-gray-500">{client.telephone}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Entreprise</p>
                <p className="text-sm text-gray-500">{client.entreprise}</p>
              </div>
            </div>
            {(client.adresse || client.code_postal || client.ville) && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-gray-500">
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
                <p className="font-medium">Date de création</p>
                <p className="text-sm text-gray-500">{formatDate(client.date_creation)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`mailto:${client.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer un email
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activité</CardTitle>
            <CardDescription>Documents et projets du client</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="documents">
              <TabsList className="mb-4">
                <TabsTrigger value="documents">
                  <FileText className="mr-2 h-4 w-4" />
                  Documents ({documents.length})
                </TabsTrigger>
                <TabsTrigger value="projects">
                  <Folder className="mr-2 h-4 w-4" />
                  Projets ({projects.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="documents">
                {documents.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <FileText className="mb-2 h-8 w-8 text-gray-400" />
                    <h3 className="mb-1 text-lg font-medium">Aucun document</h3>
                    <p className="text-sm text-gray-500">Ce client n'a pas encore de documents.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/admin/documents/ajouter">Ajouter un document</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc) => (
                          <TableRow key={doc.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium">{doc.titre}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
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
                                variant={
                                  doc.statut === "payé" || doc.statut === "signé"
                                    ? "default"
                                    : doc.statut === "en_attente"
                                      ? "secondary"
                                      : doc.statut === "refusé" || doc.statut === "expiré"
                                        ? "destructive"
                                        : "outline"
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
                            <TableCell>{formatDate(doc.date_creation)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="projects">
                {projects.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <Folder className="mb-2 h-8 w-8 text-gray-400" />
                    <h3 className="mb-1 text-lg font-medium">Aucun projet</h3>
                    <p className="text-sm text-gray-500">Ce client n'a pas encore de projets.</p>
                    <Button className="mt-4">Ajouter un projet</Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Progression</TableHead>
                          <TableHead>Date de début</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium">{project.nom}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  project.statut === "terminé"
                                    ? "default"
                                    : project.statut === "en_cours"
                                      ? "secondary"
                                      : project.statut === "annulé"
                                        ? "destructive"
                                        : "outline"
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
                                <span className="text-xs font-medium">{project.progression}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(project.date_debut)}</TableCell>
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
