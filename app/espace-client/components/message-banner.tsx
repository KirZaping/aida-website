"use client"

import { useSearchParams } from "next/navigation"

export default function MessagesBanner() {
  const sp       = useSearchParams()
  const success  = sp.get("success") === "1"
  const errType  = sp.get("err")

  if (!success && !errType) return null

  return (
    <>
      {success && (
        <p className="text-green-600">Invitation envoyée avec succès&nbsp;!</p>
      )}
      {errType === "db" && (
        <p className="text-red-600">
          Impossible d’enregistrer le collaborateur. Réessaie plus tard.
        </p>
      )}
      {errType === "email" && (
        <p className="text-orange-600">
          Collaborateur ajouté, mais l’e-mail d’invitation n’a pas pu être envoyé
          (vérifie la configuration SMTP).
        </p>
      )}
    </>
  )
}
