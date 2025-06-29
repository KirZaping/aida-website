import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Fonction pour gérer la déconnexion
export async function POST() {
  cookies().delete("client_session")

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), {
    status: 303,
  })
}

// Fontion de déconnection, méthode GET
export async function GET() {
  cookies().delete("client_session")

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), {
    status: 302,
  })
}
