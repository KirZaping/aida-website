"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, Clock, Loader2, MoreHorizontal, RefreshCw, Search } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface DevisTableProps {
  devis: any[]
  loading: boolean
  onRefresh: () => void
}

export function DevisTable({ devis, loading, onRefresh }: DevisTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevis, setSelectedDevis] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const filteredDevis = devis.filter(
    (d) =>
      d.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.entreprise && d.entreprise.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(true)

      // Mise à jour du statut dans Supabase
      const { error } = await supabaseAdmin
        .from("devis")
        .update({
          statut: newStatus,
          date_modification: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        console.error("Erreur lors de la mise à jour du statut:", error)
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut du devis",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Succès",
          description: "Le statut du devis a été mis à jour",
        })
        onRefresh()
      }
    } catch (err) {
      console.error("Exception lors de la mise à jour du statut:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nouveau":
        return <Badge variant="default">Nouveau</Badge>
      case "en_cours":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            En cours
          </Badge>
        )
      case "termine":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Terminé
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr })
    } catch (e) {
      return "Date invalide"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Actualiser
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-500" />
                </TableCell>
              </TableRow>
            ) : filteredDevis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun devis trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredDevis.slice(0, 10).map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="font-medium">{d.nom}</div>
                    <div className="text-sm text-gray-500">{d.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {d.services.map((service: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{d.budget}</TableCell>
                  <TableCell>{formatDate(d.date_creation)}</TableCell>
                  <TableCell>{getStatusBadge(d.statut)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDevis(d)
                            setIsDialogOpen(true)
                          }}
                        >
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(d.id, "nouveau")}>
                          Marquer comme nouveau
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(d.id, "en_cours")}>
                          Marquer comme en cours
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(d.id, "termine")}>
                          Marquer comme terminé
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog pour afficher les détails du devis */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDevis && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du devis</DialogTitle>
              <DialogDescription>Devis soumis le {formatDate(selectedDevis.date_creation)}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Informations client</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Nom</div>
                  <div>{selectedDevis.nom}</div>
                  <div className="font-medium">Email</div>
                  <div>{selectedDevis.email}</div>
                  <div className="font-medium">Téléphone</div>
                  <div>{selectedDevis.telephone || "Non renseigné"}</div>
                  <div className="font-medium">Entreprise</div>
                  <div>{selectedDevis.entreprise || "Non renseigné"}</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Informations projet</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Services</div>
                  <div>{selectedDevis.services.join(", ")}</div>
                  <div className="font-medium">Budget</div>
                  <div>{selectedDevis.budget}</div>
                  <div className="font-medium">Délai</div>
                  <div>{selectedDevis.delai || "Non renseigné"}</div>
                  <div className="font-medium">Statut</div>
                  <div>{getStatusBadge(selectedDevis.statut)}</div>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <h3 className="font-medium">Description du projet</h3>
                <div className="rounded-md bg-gray-50 p-3 text-sm">{selectedDevis.description}</div>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Changer le statut:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleStatusChange(selectedDevis.id, "nouveau")}
                  disabled={updatingStatus}
                >
                  <Clock className="h-3.5 w-3.5" />
                  Nouveau
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleStatusChange(selectedDevis.id, "en_cours")}
                  disabled={updatingStatus}
                >
                  <Clock className="h-3.5 w-3.5" />
                  En cours
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleStatusChange(selectedDevis.id, "termine")}
                  disabled={updatingStatus}
                >
                  <Check className="h-3.5 w-3.5" />
                  Terminé
                </Button>
              </div>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
