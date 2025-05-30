"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Fonction pour effectuer la déconnexion
    async function performLogout() {
      try {
        // Appeler la route de déconnexion
        const response = await fetch("/espace-client/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        // Rediriger vers la page d'accueil
        router.push("/")
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error)
        // En cas d'erreur, rediriger quand même vers la page d'accueil
        router.push("/")
      }
    }

    // Exécuter la déconnexion
    performLogout()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Déconnexion en cours...</h1>
        <p className="text-gray-600">Vous allez être redirigé vers la page d'accueil.</p>
      </div>
    </div>
  )
}
