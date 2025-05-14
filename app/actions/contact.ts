"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function envoyerMessage(formData: FormData) {
  try {
    // Récupérer les données du formulaire
    const nom = formData.get("nom") as string
    const email = formData.get("email") as string
    const sujet = formData.get("sujet") as string
    const message = formData.get("message") as string

    // Validation basique
    if (!nom || !email || !sujet || !message) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs",
      }
    }

    // Insérer dans la base de données
    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert([
        {
          nom,
          email,
          sujet,
          message,
          lu: false,
        },
      ])
      .select()

    if (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      return {
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre message",
      }
    }

    // Réussite
    revalidatePath("/")
    return {
      success: true,
      message: "Votre message a été envoyé avec succès",
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    }
  }
}
