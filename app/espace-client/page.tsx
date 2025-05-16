import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getClientSession } from "../actions/client-auth"

export default async function EspaceClientPage() {
  // Vérifier si l'utilisateur est connecté
  const cookieStore = cookies()
  const clientSession = await getClientSession(cookieStore)

  // Si l'utilisateur est connecté, rediriger vers le tableau de bord
  if (clientSession) {
    redirect("/espace-client/dashboard")
  }

  // Sinon, rediriger vers la page de connexion
  redirect("/espace-client/login")
}
