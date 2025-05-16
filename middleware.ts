import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Vérifier si la route commence par /admin (sauf /admin/login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // Vérifier si le cookie de session admin existe
    const adminSession = request.cookies.get("admin_session")

    if (!adminSession) {
      // Rediriger vers la page de connexion admin
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      // Vérifier si la session est valide (non expirée)
      const session = JSON.parse(adminSession.value)
      if (new Date(session.expires) < new Date()) {
        // Session expirée, rediriger vers la page de connexion
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    } catch (error) {
      // Erreur de parsing JSON, rediriger vers la page de connexion
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Vérifier si la route commence par /espace-client (sauf /espace-client/login)
  if (
    request.nextUrl.pathname.startsWith("/espace-client") &&
    !request.nextUrl.pathname.startsWith("/espace-client/login") &&
    !request.nextUrl.pathname.startsWith("/espace-client/logout")
  ) {
    // Vérifier si le cookie de session client existe
    const clientSession = request.cookies.get("client_session")

    if (!clientSession) {
      // Rediriger vers la page de connexion client
      return NextResponse.redirect(new URL("/espace-client/login", request.url))
    }

    try {
      // Vérifier si la session est valide (non expirée)
      const session = JSON.parse(clientSession.value)
      if (new Date(session.expires) < new Date()) {
        // Session expirée, rediriger vers la page de connexion
        return NextResponse.redirect(new URL("/espace-client/login", request.url))
      }
    } catch (error) {
      // Erreur de parsing JSON, rediriger vers la page de connexion
      return NextResponse.redirect(new URL("/espace-client/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/espace-client/:path*"],
}
