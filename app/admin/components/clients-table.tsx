import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

interface ClientsTableProps {
  clients: any[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Aucun client trouvé.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <a href={`/admin/clients/${client.id}`} className="hover:underline">
                    {client.nom}
                  </a>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  {client.type ? (
                    <Badge
                      variant={
                        client.type === "client" ? "default" : client.type === "prospect" ? "outline" : "secondary"
                      }
                    >
                      {client.type}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Non défini</Badge>
                  )}
                </TableCell>
                <TableCell>{client.date_creation ? formatDate(client.date_creation) : "Date inconnue"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
