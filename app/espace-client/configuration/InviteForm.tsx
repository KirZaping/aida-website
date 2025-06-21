// /app/espace-client/configuration/InviteForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

/**
 * InviteForm :
 * - client-side, car il utilise le hook useState
 * - Envoit un POST à /api/collaborateurs pour stocker l’e-mail du collaborateur
 */
export default function InviteForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch("/api/collaborateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue")
      }
      setMessage("Invitation envoyée avec succès !")
      setEmail("")
    } catch (err: any) {
      setError(err?.message || "Impossible d’ajouter ce collaborateur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-mail du collaborateur
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collaborateur@exemple.com"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Button type="submit" disabled={loading}>
          {loading ? "Envoi…" : "Envoyer l’invitation"}
        </Button>
      </div>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  )
}
