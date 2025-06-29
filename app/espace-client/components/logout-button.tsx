"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/espace-client/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      router.push("/")
    }
  }

  return (
    <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
      <LogOut className="h-4 w-4" />
      <span>Déconnexion</span>
    </Button>
  )
}
