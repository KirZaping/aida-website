import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatFileSize } from "@/lib/utils"

interface DocumentsTableProps {
  documents: any[]
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Aucun document trouvé.
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">
                  <a href={`/admin/documents/${document.id}`} className="hover:underline">
                    {document.titre}
                  </a>
                  {document.fichier_taille && (
                    <div className="text-xs text-muted-foreground">{formatFileSize(document.fichier_taille)}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{document.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      document.statut === "publié"
                        ? "default"
                        : document.statut === "brouillon"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {document.statut}
                  </Badge>
                </TableCell>
                <TableCell>{document.date_creation ? formatDate(document.date_creation) : "Date inconnue"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
