import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

interface ClientsTableProps {
  clients: any[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  return (
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-900">Nom</TableHead>
            <TableHead className="text-gray-900">Email</TableHead>
            <TableHead className="text-gray-900">Type</TableHead>
            <TableHead className="text-gray-900">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-gray-600">
                Aucun client trouvé.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  <a href={`/admin/clients/${client.id}`} className="hover:underline hover:text-blue-600">
                    {client.nom}
                  </a>
                </TableCell>
                <TableCell className="text-gray-700">{client.email}</TableCell>
                <TableCell>
                  {client.type ? (
                    <Badge
                      className={
                        client.type === "client"
                          ? "bg-blue-600 text-white"
                          : client.type === "prospect"
                            ? "bg-white text-gray-700 border border-gray-300"
                            : "bg-gray-200 text-gray-900"
                      }
                    >
                      {client.type}
                    </Badge>
                  ) : (
                    <Badge className="bg-white text-gray-700 border border-gray-300">Non défini</Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">
                  {client.date_creation ? formatDate(client.date_creation) : "Date inconnue"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
