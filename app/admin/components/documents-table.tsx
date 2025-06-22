// DocumentsTable.tsx
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatFileSize } from "@/lib/utils"

interface DocumentsTableProps {
  documents: any[]
}

const statusConfig: Record<string, { label: string; variant: any }> = {
  en_attente: { label: "En attente", variant: "waiting" },
  payé: { label: "Payé", variant: "paid" },
  signé: { label: "Signé", variant: "signed" },
  refusé: { label: "Refusé", variant: "refused" },
  expiré: { label: "Expiré", variant: "expired" },
  brouillon: { label: "Brouillon", variant: "draft" },
}

const typeConfig: Record<string, { label: string; variant: any }> = {
  facture: { label: "Facture", variant: "invoice" },
  devis: { label: "Devis", variant: "quote" },
  contrat: { label: "Contrat", variant: "contract" },
  autre: { label: "Autre", variant: "other" },
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
            documents.map((document) => {
              const status = statusConfig[document.statut] ?? { label: document.statut, variant: "outline" }
              const docType = typeConfig[document.type] ?? { label: document.type, variant: "outline" }
              return (
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
                    <Badge variant={docType.variant}>{docType.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>{document.date_creation ? formatDate(document.date_creation) : "Date inconnue"}</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
