// /app/espace-client/configuration/page.tsx
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
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


async function inviteCollaborator(formData: FormData) {
  "use server"

  // 1) Récupérer l’e-mail depuis le FormData
  const email = formData.get("email") as string
  if (!email || typeof email !== "string") {
    throw new Error("Email invalide")
  }

  // 2) Vérifier la session
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)
  if (!session) {
    // Si l’utilisateur n’est plus authentifié, on peut rediriger
    redirect("/espace-client/login")
  }

  const { error } = await supabaseAdmin
    .from("collaborateurs")
    .insert([{ client_id: session.id, email, statut_invitation: "en_attente" }])

  if (error) {
    throw new Error(error.message)
  }

  // Après insertion, on peut rediriger (ou simplement “retourner”)
  redirect("/espace-client/configuration?success=1")
}

export default async function ConfigurationPage() {
  // 1) Vérifier la session
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)
  if (!session) {
    redirect("/espace-client/login")
  }


  return (
    <div className="space-y-6">
      {/* En-tête avec bouton “Retour” */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-muted-foreground">
            Gérer les collaborateurs pour :{" "}
            <span className="font-medium">{session.entreprise}</span>
          </p>
        </div>
      </div>

      {/* Formulaire d’invitation, qui déclenche la Server Action `inviteCollaborator` */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un collaborateur</CardTitle>
          <CardDescription>
            Entrez l’e-mail du collaborateur pour l’inviter dans votre espace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 
            Lorsque l’on soumet ce formulaire, Next.js appellera automatiquement
            la fonction `inviteCollaborator` définie plus haut (grâce à "action").
          */}
          <form action={inviteCollaborator} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail du collaborateur
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="collaborateur@exemple.com"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <Button type="submit">Envoyer l’invitation</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
