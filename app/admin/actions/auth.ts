"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Veuillez fournir un nom d'utilisateur et un mot de passe" }
  }

  try {
    console.log(`Tentative de connexion pour l'utilisateur: ${username}`)

    // Vérifier les identifiants dans la table admin_users
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, role")
      .eq("username", username)
      .eq("password", password)
      .single()

    if (error) {
      console.error("Erreur lors de la vérification des identifiants:", error)
      return { success: false, error: "Erreur lors de la vérification des identifiants" }
    }

    if (!data) {
      console.log("Identifiants incorrects")
      return { success: false, error: "Identifiants incorrects" }
    }

    // Mettre à jour la date de dernière connexion
    await supabaseAdmin.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", data.id)

    // Créer une session sécurisée avec un cookie
    const sessionExpiry = new Date()
    sessionExpiry.setHours(sessionExpiry.getHours() + 24) // Session de 24 heures

    // Stocker les informations de session dans un cookie
    cookies().set(
      "admin_session",
      JSON.stringify({
        id: data.id,
        username: data.username,
        role: data.role,
        expires: sessionExpiry.toISOString(),
      }),
      {
        expires: sessionExpiry,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      },
    )

    console.log(`Connexion réussie pour l'utilisateur: ${username}`)
    return { success: true, user: { username: data.username, role: data.role } }
  } catch (err) {
    console.error("Exception lors de la connexion:", err)
    return { success: false, error: "Une erreur est survenue lors de la connexion" }
  }
}

export async function logoutAdmin() {
  cookies().delete("admin_session")
  return { success: true }
}

export async function getAdminSession() {
  const sessionCookie = cookies().get("admin_session")

  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    // Vérifier si la session a expiré
    if (new Date(session.expires) < new Date()) {
      cookies().delete("admin_session")
      return null
    }

    return session
  } catch (err) {
    console.error("Erreur lors de la lecture de la session:", err)
    return null
  }
}
