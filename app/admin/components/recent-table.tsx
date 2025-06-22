// components/recent-table.tsx
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

interface RecentTableProps {
  activities: { id: string; type: string; label: string; date_creation: string }[]
}

const typeConfig: Record<string, { label: string; variant: any }> = {
  devis: { label: "Devis", variant: "quote" },
  client: { label: "Client", variant: "outline" },
  document: { label: "Document", variant: "other" },
}

export function RecentTable({ activities }: RecentTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Aucune activité récente.
              </TableCell>
            </TableRow>
          ) : (
            activities.map((a) => {
              const cfg = typeConfig[a.type] ?? { label: a.type, variant: "outline" }
              return (
                <TableRow key={a.id}>
                  <TableCell>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {a.type === "devis" && `Nouveau devis : ${a.label}`}
                    {a.type === "client" && `Nouveau client : ${a.label}`}
                    {a.type === "document" && `Nouveau document : ${a.label}`}
                  </TableCell>
                  <TableCell>{a.date_creation ? formatDate(a.date_creation) : "Date inconnue"}</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
