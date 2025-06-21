import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getClientSession } from "@/app/actions/client-auth"
import {
  getClientProfile,
  getClientCollaborators,
} from "@/app/actions/client-data"
import { ProfileSection } from "./components/ProfileSection"
import { CollaboratorsSection } from "./components/CollaboratorsSection"

export default async function ProfilePage() {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  if (!session) {
    redirect("/espace-client/login")
  }

  const { profile, error: profileError } = await getClientProfile(session.id)
  const { collaborators, error: collabError } = await getClientCollaborators(session.id)

  return (
    <div className="space-y-6">
      {profileError ? (
        <div className="text-red-600">Impossible de charger les informations de profil.</div>
      ) : (
        <ProfileSection profile={profile!} clientId={session.id} />
      )}

      {collabError ? (
        <div className="text-red-600">Impossible de charger les collaborateurs.</div>
      ) : (
        <CollaboratorsSection collaborators={collaborators} clientId={session.id} />
      )}
    </div>
  )
}
