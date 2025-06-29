"use client"

import { useState, useTransition } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { deleteCollaborator } from "@/app/actions/client-data"

type Collaborator = {
  id: string
  email: string
  statut_invitation: string
  date_invitation?: string
}

interface Props {
  collaborators: Collaborator[]
  clientId: string
}

export function CollaboratorsSection({ collaborators, clientId }: Props) {
  const [list, setList] = useState(collaborators)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatInviteStatus = (status: string) =>
    status === "en_attente" ? "En attente"
    : status === "accepted"  ? "Accepté"
    : status

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const res = await deleteCollaborator(id)
      if (res.success) {
        setList(l => l.filter(c => c.id !== id))
      }
      setDeletingId(null)
    })
  }

  return (
    <div className="border rounded p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Collaborateurs</h2>
        <p className="text-muted-foreground">Liste des collaborateurs invités</p>
      </div>

      {list.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {list.map(c => (
            <div key={c.id} className="relative border rounded p-4 space-y-2">
              <button
                className="absolute top-2 right-2 p-1"
                onClick={() => handleDelete(c.id)}
                disabled={isPending && deletingId === c.id}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{c.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Statut invitation</p>
                <Badge className={getStatusColor(c.statut_invitation)}>
                  {formatInviteStatus(c.statut_invitation)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Date invitation</p>
                <p className="text-sm text-muted-foreground">
                  {c.date_invitation
                    ? new Date(c.date_invitation).toLocaleDateString("fr-FR")
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Aucun collaborateur invité.</p>
      )}
    </div>
  )
}
