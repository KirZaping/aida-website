import type React from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { User, FileText, Home, Building } from "lucide-react"

import { getClientSession } from "../actions/client-auth"
import { LogoutButton } from "./components/logout-button"

export default async function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore   = await cookies()
  const clientSession = await getClientSession(cookieStore)

  const pathname = new URL(
    cookieStore.get("next-url")?.value || "/",
    "http://localhost",
  ).pathname

  /* Pages login/logout : pas de layout */
  if (pathname.includes("/espace-client/login") || pathname.includes("/espace-client/logout")) {
    return <>{children}</>
  }

  /* Non connecté ? Pas de layout non plus */
  if (!clientSession) return <>{children}</>

  /* Layout complet */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/espace-client/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Espace Client</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden md:inline-block">
              {clientSession.entreprise}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Corps */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <nav className="p-4 space-y-1">
            <NavItem href="/espace-client/dashboard" icon={Home} label="Tableau de bord" />
            <NavItem href="/espace-client/info-contrat" icon={Building} label="Projets" />
            <NavItem href="/espace-client/documents" icon={FileText} label="Documents" />
            <NavItem href="/espace-client/profil" icon={User} label="Profil entreprise" />
            <NavItem href="/espace-client/configuration" icon={User} label="Configuration" />
          </nav>
        </aside>

        {/* Contenu */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ElementType
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      <Icon className="h-5 w-5 text-gray-500" />
      <span>{label}</span>
    </Link>
  )
}
