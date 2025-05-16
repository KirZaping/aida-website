"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getClient } from "../../../actions/clients"
import ClientForm from "../../../components/client-form"

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getClient(params.id)

        if (result.error) {
          setError(result.error)
          return
        }

        setClient(result.client)
      } catch (err) {
        console.error("Erreur lors de la récupération du client:", err)
        setError(`Une erreur est survenue: ${err instanceof Error ? err.message : "Erreur inconnue"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [params.id])

  if (loading) {
    return (
      <div className="container max-w-5xl p-6">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-5xl p-6">
        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="container max-w-5xl p-6">
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTitle>Client introuvable</AlertTitle>
          <AlertDescription>Le client demandé n'existe pas ou a été supprimé.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push("/admin/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste des clients
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Modifier le client</h1>
      </div>

      <ClientForm
        initialData={client}
        clientId={params.id}
        onSuccess={(updatedClient) => {
          router.push(`/admin/clients/${params.id}`)
        }}
      />
    </div>
  )
}
