"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function inscrireNewsletter(formData: FormData) {
  try {
    // Récupérer l'email
    const email = formData.get("email") as string

    // Validation basique
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return {
        success: false,
        message: "Veuillez fournir une adresse email valide",
      }
    }

    // Vérifier si l'email existe déjà
    const { data: existingEmail } = await supabaseAdmin.from("newsletter").select().eq("email", email).single()

    if (existingEmail) {
      return {
        success: false,
        message: "Cette adresse email est déjà inscrite à notre newsletter",
      }
    }

    // Insérer dans la base de données
    const { data, error } = await supabaseAdmin
      .from("newsletter")
      .insert([
        {
          email,
          actif: true,
        },
      ])
      .select()

    if (error) {
      console.error("Erreur lors de l'inscription à la newsletter:", error)
      return {
        success: false,
        message: "Une erreur est survenue lors de votre inscription",
      }
    }

    // Réussite
    revalidatePath("/blog")
    return {
      success: true,
      message: "Vous êtes maintenant inscrit à notre newsletter",
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription à la newsletter:", error)
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    }
  }
}
