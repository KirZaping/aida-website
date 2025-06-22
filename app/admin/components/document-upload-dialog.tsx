"use client"

import { useState } from "react"
import { supabaseAdmin, ensureClientFolder } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, FileUp } from "lucide-react"
import { formatFileSize } from "@/lib/utils"

export function DocumentUploadDialog({ clientId, onUploaded }: { clientId: string; onUploaded: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    client_id: clientId,
    titre: "",
    description: "",
    type: "facture",
    statut: "en_attente",
    montant: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const setField = (name: string, value: string) => setFormData({ ...formData, [name]: value })

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Sélectionner un fichier")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const ok = await ensureClientFolder(formData.client_id)
      if (!ok) throw new Error("Dossier client absent")
      const ext = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `${formData.client_id}/${fileName}`
      const { error: upErr } = await supabaseAdmin.storage.from("client-documents").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })
      if (upErr) throw upErr
      const { error: insErr } = await supabaseAdmin.from("documents").insert({
        client_id: formData.client_id,
        titre: formData.titre,
        description: formData.description,
        type: formData.type,
        statut: formData.statut,
        montant: formData.montant ? Number.parseFloat(formData.montant) : null,
        fichier_path: path,
        fichier_nom: file.name,
        fichier_type: file.type,
        fichier_taille: file.size,
      })
      if (insErr) throw insErr
      await supabaseAdmin.from("document_notifications").insert({
        document_id: (await supabaseAdmin.from("documents").select("id").eq("fichier_path", path).single()).data?.id,
        client_id: formData.client_id,
        type: "nouveau_document",
        message: `Un nouveau document "${formData.titre}" a été ajouté à votre espace client`,
      })
      setSuccess(true)
      onUploaded()
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setFormData({ ...formData, titre: "", description: "", montant: "" })
        setFile(null)
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4">
          <FileUp className="mr-2 h-4 w-4" />
          Ajouter un document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau document</DialogTitle>
          <DialogDescription>Téléchargez un document et associez-le à ce client.</DialogDescription>
        </DialogHeader>
        <form onSubmit={upload}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre</Label>
              <Input id="titre" name="titre" value={formData.titre} onChange={(e) => setField("titre", e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={(e) => setField("description", e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setField("type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facture">Facture</SelectItem>
                    <SelectItem value="devis">Devis</SelectItem>
                    <SelectItem value="contrat">Contrat</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Statut</Label>
                <Select value={formData.statut} onValueChange={(v) => setField("statut", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="payé">Payé</SelectItem>
                    <SelectItem value="signé">Signé</SelectItem>
                    <SelectItem value="refusé">Refusé</SelectItem>
                    <SelectItem value="expiré">Expiré</SelectItem>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="montant">Montant (€)</Label>
              <Input id="montant" name="montant" type="number" step="0.01" value={formData.montant} onChange={(e) => setField("montant", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">Fichier</Label>
              <Input id="file" type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
              {file && <p className="text-xs text-gray-500">{file.name} ({formatFileSize(file.size)})</p>}
            </div>
          </div>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>Document téléchargé avec succès !</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                "Télécharger"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
