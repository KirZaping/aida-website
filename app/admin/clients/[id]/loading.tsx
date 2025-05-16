import { Loader2 } from "lucide-react"

export default function ClientDetailLoading() {
  return (
    <div className="container max-w-7xl p-6">
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    </div>
  )
}
