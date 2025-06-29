"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function soumettreDevis(formData: FormData) {
  try {
    const nom = formData.get("nom") as string
    const email = formData.get("email") as string
    const telephone = formData.get("telephone") as string
    const entreprise = formData.get("entreprise") as string
    const budget = formData.get("budget") as string
    const delai = formData.get("delai") as string
    const description = formData.get("description") as string

    const servicesFormData = formData.getAll("services") as string[]

    if (!nom || !email || !budget || !description || servicesFormData.length === 0) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires",
      }
    }

    if (!supabaseAdmin) {
      console.error("Client Supabase non disponible")
      return {
        success: false,
        message: "Erreur de connexion à la base de données",
      }
    }

    const devisData = {
      nom,
      email,
      telephone: telephone || null,
      entreprise: entreprise || null,
      services: servicesFormData,
      budget,
      delai: delai || null,
      description,
      statut: "nouveau",
      date_creation: new Date().toISOString(),
      date_modification: new Date().toISOString(),
    }

    console.log("Données à insérer:", JSON.stringify(devisData, null, 2))

    try {
      const { data, error } = await supabaseAdmin.from("devis").insert([devisData]).select()

      if (error) {
        console.error("Erreur Supabase lors de l'insertion:", error)
        console.error("Code d'erreur:", error.code)
        console.error("Message d'erreur:", error.message)
        console.error("Détails:", error.details)

        return {
          success: false,
          message: `Erreur lors de l'enregistrement: ${error.message || "Erreur inconnue"}`,
        }
      }

      console.log("Devis inséré avec succès:", data)
      revalidatePath("/devis")
      return {
        success: true,
        message: "Votre demande a été envoyée avec succès",
      }
    } catch (insertError: any) {
      console.error("Exception lors de l'insertion:", insertError)

      return {
        success: false,
        message: `Exception lors de l'insertion: ${insertError instanceof Error ? insertError.message : "Erreur inconnue"}`,
      }
    }
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    console.error("Erreur lors de la soumission du devis:", error)
    console.error("Message d'erreur:", errorMessage)

    return {
      success: false,
      message: `Une erreur est survenue: ${errorMessage}`,
    }
  }
}
