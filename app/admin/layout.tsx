import type { ReactNode } from "react"
import { AdminHeader } from "./components/admin-header"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />                               
      <main className="flex-1">{children}</main>
    </div>
  )
}
