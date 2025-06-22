// app/admin/layout.tsx
import type { ReactNode } from "react"
import { AdminHeader } from "./components/admin-header"   // ← ton composant client

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />                                    {/* toujours visible */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
