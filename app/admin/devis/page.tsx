import { Suspense } from "react"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase"
import { DevisTable } from "../components/devis-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Fonction pour récupérer tous les devis depuis Supabase
async function fetchAllDevis() {
  try {
    const { data, error } = await supabaseAdmin.from("devis").select("*").order("date_creation", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des devis:", error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Exception lors de la récupération des devis:", error)
    return []
  }
}

export default async function DevisPage() {
  // Récupérer tous les devis
  const devis = await fetchAllDevis()

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tous les devis</h1>
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Chargement des devis...</div>}>
        <DevisTable devis={devis} />
      </Suspense>
    </div>
  )
}
