import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Fonction pour gérer la déconnexion
export async function POST() {
  // Supprimer le cookie de session
  cookies().delete("client_session")

  // Utiliser un code de statut 303 pour forcer une redirection après un POST
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), {
    status: 303,
  })
}

// Ajouter également une méthode GET pour plus de flexibilité
export async function GET() {
  // Supprimer le cookie de session
  cookies().delete("client_session")

  // Rediriger vers la page d'accueil avec une URL absolue
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), {
    status: 302,
  })
}
