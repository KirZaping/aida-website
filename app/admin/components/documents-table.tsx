import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatFileSize } from "@/lib/utils"

interface DocumentsTableProps {
  documents: any[]
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  return (
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-900">Titre</TableHead>
            <TableHead className="text-gray-900">Type</TableHead>
            <TableHead className="text-gray-900">Statut</TableHead>
            <TableHead className="text-gray-900">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-gray-600">
                Aucun document trouvé.
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow key={document.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  <a href={`/admin/documents/${document.id}`} className="hover:underline hover:text-blue-600">
                    {document.titre}
                  </a>
                  {document.fichier_taille && (
                    <div className="text-xs text-gray-500">{formatFileSize(document.fichier_taille)}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className="bg-white text-gray-700 border border-gray-300">{document.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      document.statut === "publié"
                        ? "bg-blue-600 text-white"
                        : document.statut === "brouillon"
                          ? "bg-white text-gray-700 border border-gray-300"
                          : "bg-gray-200 text-gray-900"
                    }
                  >
                    {document.statut}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {document.date_creation ? formatDate(document.date_creation) : "Date inconnue"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
