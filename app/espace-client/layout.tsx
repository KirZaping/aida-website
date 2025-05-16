import type React from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { User, FileText, Home } from "lucide-react"

import { getClientSession } from "../actions/client-auth"
import { LogoutButton } from "./components/logout-button"

export default async function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier si l'utilisateur est connecté
  const cookieStore = cookies()
  const clientSession = await getClientSession(cookieStore)
  const pathname = new URL(cookies().get("next-url")?.value || "/", "http://localhost").pathname

  // Si on est sur la page de login ou logout, afficher simplement le contenu sans layout
  if (pathname.includes("/espace-client/login") || pathname.includes("/espace-client/logout")) {
    return <>{children}</>
  }

  // Si l'utilisateur n'est pas connecté, ne pas afficher le layout
  if (!clientSession) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/espace-client/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Espace Client</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden md:inline-block">{clientSession.entreprise}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex flex-1">
        {/* Barre latérale */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <nav className="p-4 space-y-1">
            <Link
              href="/espace-client/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5 text-gray-500" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              href="/espace-client/documents"
              className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FileText className="h-5 w-5 text-gray-500" />
              <span>Documents</span>
            </Link>
            <Link
              href="/espace-client/profil"
              className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5 text-gray-500" />
              <span>Profil entreprise</span>
            </Link>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
