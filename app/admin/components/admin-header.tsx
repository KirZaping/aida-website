"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, FileText, Home, LogOut, Settings, User, File } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Supprimer le cookie de session
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // Rediriger vers la page de connexion
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <BarChart3 className="h-5 w-5" />
            <span>Admin Dashboard</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium hover:underline">
              <Home className="mr-1 inline-block h-4 w-4" />
              Accueil
            </Link>
            <Link href="/admin/devis" className="text-sm font-medium hover:underline">
              <FileText className="mr-1 inline-block h-4 w-4" />
              Devis
            </Link>
            <Link href="/admin/documents" className="text-sm font-medium hover:underline">
              <File className="mr-1 inline-block h-4 w-4" />
              Documents
            </Link>
            <Link href="/admin/clients" className="text-sm font-medium hover:underline">
              <User className="mr-1 inline-block h-4 w-4" />
              Clients
            </Link>
            <Link href="/admin/settings" className="text-sm font-medium hover:underline">
              <Settings className="mr-1 inline-block h-4 w-4" />
              Paramètres
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}
