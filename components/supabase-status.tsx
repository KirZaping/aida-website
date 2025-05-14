"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { checkSupabaseConnection, checkTableExists } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SupabaseStatus() {
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function verifyConnection() {
      try {
        // Vérifier si les variables d'environnement Supabase sont définies
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setError("Les variables d'environnement Supabase ne sont pas correctement configurées.")
          return
        }

        // Vérifier la connexion à Supabase
        const isConnected = await checkSupabaseConnection()
        if (!isConnected) {
          setError("Impossible de se connecter à la base de données Supabase.")
          return
        }

        // Si la connexion est réussie, vérifier si les tables existent
        const devisTableExists = await checkTableExists("devis")
        const contactsTableExists = await checkTableExists("contacts")
        const newsletterTableExists = await checkTableExists("newsletter")

        if (!devisTableExists || !contactsTableExists || !newsletterTableExists) {
          setWarning(
            "Connexion à Supabase réussie, mais certaines tables nécessaires n'existent pas. " +
              "Le site fonctionne en mode développement avec stockage local.",
          )
        } else {
          // Tout est OK
          console.log("Connexion Supabase et tables vérifiées avec succès")
        }
      } catch (err) {
        setError("Une erreur est survenue lors de la vérification de la connexion à Supabase.")
        console.error("Erreur de vérification Supabase:", err)
      } finally {
        setChecking(false)
      }
    }

    verifyConnection()
  }, [])

  if (checking) return null

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-2">
          <span>{error} Veuillez vérifier votre configuration Supabase dans les paramètres du projet Vercel.</span>
          <span className="text-xs">
            Note: Le site fonctionne en mode développement, mais certaines fonctionnalités comme l'enregistrement des
            demandes de devis ne seront pas disponibles.
          </span>
        </AlertDescription>
      </Alert>
    )
  }

  if (warning) {
    return (
      <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-500" />
        <AlertDescription className="flex flex-col gap-2 text-amber-700">
          <span>{warning}</span>
          <div className="text-xs mt-1">
            <Link href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
              <Button variant="link" className="h-auto p-0 text-amber-700 underline">
                Consulter la documentation Supabase
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
