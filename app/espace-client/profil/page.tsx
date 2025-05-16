import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Building, Mail, Phone, MapPin, User, Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientSession } from "@/app/actions/client-auth"
import { getClientProfile } from "@/app/actions/client-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProfilePage() {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  if (!session) {
    redirect("/espace-client/login")
  }

  // Récupérer le profil du client
  const { profile, error } = await getClientProfile(session.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil entreprise</h1>
          <p className="text-muted-foreground">Informations de votre entreprise</p>
        </div>
        <Button asChild>
          <Link href="/espace-client/profil/modifier">Modifier</Link>
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Impossible de charger les informations de profil. Veuillez réessayer plus tard.
            </p>
          </CardContent>
        </Card>
      ) : profile ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Détails de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">Raison sociale</p>
                  <p className="text-sm text-muted-foreground">{profile.nom_entreprise}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">{profile.telephone || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">{profile.adresse || "Non renseignée"}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.code_postal ? `${profile.code_postal} ${profile.ville || ""}` : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations légales</CardTitle>
              <CardDescription>Détails administratifs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">SIRET</p>
                  <p className="text-sm text-muted-foreground">{profile.siret || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">Forme juridique</p>
                  <p className="text-sm text-muted-foreground">{profile.forme_juridique || "Non renseignée"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">Date de création</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.date_creation
                      ? new Date(profile.date_creation).toLocaleDateString("fr-FR")
                      : "Non renseignée"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contact principal</CardTitle>
              <CardDescription>Personne à contacter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">Nom</p>
                  <p className="text-sm text-muted-foreground">{profile.nom || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Prénom</p>
                  <p className="text-sm text-muted-foreground">{profile.prenom || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Aucune information de profil disponible.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
