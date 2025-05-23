import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] max-w-7xl items-center justify-center p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <h3 className="text-xl font-semibold">Chargement...</h3>
        <p className="text-sm text-gray-500">Veuillez patienter pendant le chargement des données.</p>
      </div>
    </div>
  )
}
