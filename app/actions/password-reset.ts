"use server"

import { siteConfig } from "@/lib/config"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"

// Envoyer un email de réinitialisation de mot de passe
export async function sendPasswordResetEmail(email: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Utiliser l'API Supabase pour envoyer un email de réinitialisation
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteConfig.url}/espace-client/reset-password`,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error)
    return {
      success: false,
      error: "Impossible d'envoyer l'email de réinitialisation. Veuillez vérifier votre adresse email.",
    }
  }
}

// Réinitialiser le mot de passe avec un token
export async function resetPassword(newPassword: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Mettre à jour le mot de passe
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error)
    return {
      success: false,
      error: "Impossible de réinitialiser le mot de passe. Le lien a peut-être expiré.",
    }
  }
}
