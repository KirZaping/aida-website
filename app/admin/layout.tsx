import type React from "react"
import { AdminHeader } from "./components/admin-header"
import { cookies } from "next/headers"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier si l'utilisateur est connecté pour afficher ou non l'en-tête
  const isLoggedIn = cookies().has("admin_session")

  return (
    <div className="flex min-h-screen flex-col">
      {isLoggedIn && <AdminHeader />}
      <main className="flex-1">{children}</main>
    </div>
  )
}
