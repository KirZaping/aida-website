import { Loader2 } from "lucide-react"

export default function EditClientLoading() {
  return (
    <div className="container max-w-5xl p-6">
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    </div>
  )
}
