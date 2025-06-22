import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { getClientSession } from "@/app/actions/client-auth"
import { supabaseAdmin } from "@/lib/supabase"

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MessagesBanner from "../components/message-banner"   // ← nouveau composant client

/* ────────────────────────────────────────────────────────── */
/*  Server Action                                            */
/* ────────────────────────────────────────────────────────── */
async function inviteCollaborator(formData: FormData) {
  "use server"

  const email = formData.get("email") as string
  if (!email) throw new Error("E-mail invalide")

  const session = await getClientSession()
  if (!session) redirect("/espace-client/login")

  /* Insertion en base */
  const { error: insertErr } = await supabaseAdmin.from("collaborateurs").insert({
    client_id: session.id,
    email,
    statut_invitation: "invité",
  })
  if (insertErr) {
    redirect("/espace-client/configuration?err=db")
  }

  /* Invitation Auth (envoi d’e-mail) */
  const { error: inviteErr } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { client_id: session.id },
    })

  if (inviteErr) {
    redirect("/espace-client/configuration?err=email")
  }

  redirect("/espace-client/configuration?success=1")
}

/* ────────────────────────────────────────────────────────── */
/*  Page                                                     */
/* ────────────────────────────────────────────────────────── */
export default async function ConfigurationPage() {
  const session = await getClientSession()
  if (!session) redirect("/espace-client/login")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-muted-foreground">
            Gérer les collaborateurs pour&nbsp;
            <span className="font-medium">{session.entreprise}</span>
          </p>
        </div>
      </div>

      {/* Messages “flash” (client component) */}
      <MessagesBanner />

      {/* Formulaire d’invitation */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un collaborateur</CardTitle>
          <CardDescription>
            Entrez l’e-mail du collaborateur pour l’inviter dans votre espace.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  placeholder="collegue@exemple.com"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <Button type="submit">Envoyer l’invitation</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
