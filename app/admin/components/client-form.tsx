"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { addClient, updateClient } from "../actions/clients"

// Schéma de validation pour le formulaire client
const clientSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  telephone: z.string().optional(),
  nom_entreprise: z.string().min(1, "Le nom de l'entreprise est requis"),
  adresse: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().optional(),
  pays: z.string().optional(),
  notes: z.string().optional(),
  type: z.enum(["client", "prospect", "partenaire"]).default("client"),
  mot_de_passe: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  initialData?: any
  clientId?: string
  onSuccess?: (client: any) => void
}

export default function ClientForm({ initialData, clientId, onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isEditMode = !!clientId

  // Initialiser le formulaire avec les données existantes ou des valeurs par défaut
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: initialData?.nom || "",
      prenom: initialData?.prenom || "",
      email: initialData?.email || "",
      telephone: initialData?.telephone || "",
      nom_entreprise: initialData?.nom_entreprise || "",
      adresse: initialData?.adresse || "",
      code_postal: initialData?.code_postal || "",
      ville: initialData?.ville || "",
      pays: initialData?.pays || "",
      notes: initialData?.notes || "",
      type: initialData?.type || "client",
      mot_de_passe: "",
    },
  })

  const onSubmit = async (data: ClientFormValues) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Si le mot de passe est vide et nous sommes en mode édition, ne pas l'inclure dans la mise à jour
      if (isEditMode && !data.mot_de_passe) {
        delete data.mot_de_passe
      }

      const result = isEditMode ? await updateClient(clientId!, data) : await addClient(data as any)

      if (result.error) {
        setError(result.error)
        return
      }

      setSuccess(isEditMode ? "Le client a été mis à jour avec succès." : "Le client a été ajouté avec succès.")

      if (onSuccess) {
        onSuccess(result.client)
      }
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err)
      setError(`Une erreur est survenue: ${err instanceof Error ? err.message : "Erreur inconnue"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="Téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nom_entreprise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="client" />
                            </FormControl>
                            <FormLabel className="font-normal">Client</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="prospect" />
                            </FormControl>
                            <FormLabel className="font-normal">Prospect</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="partenaire" />
                            </FormControl>
                            <FormLabel className="font-normal">Partenaire</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-lg font-medium">Adresse</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code_postal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder="Code postal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input placeholder="Pays" {...field} value={field.value || "France"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-lg font-medium">Informations supplémentaires</h3>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notes ou commentaires sur ce client"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mot_de_passe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isEditMode ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={isEditMode ? "Nouveau mot de passe" : "Mot de passe"}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {isEditMode
                          ? "Laissez ce champ vide si vous ne souhaitez pas modifier le mot de passe."
                          : "Le mot de passe permettra au client de se connecter à son espace client."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Mettre à jour" : "Ajouter le client"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
