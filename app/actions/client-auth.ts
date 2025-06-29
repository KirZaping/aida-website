"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"

import bcrypt from "bcryptjs"


// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────
export type ClientSession = {
  id: string
  email: string
  entreprise: string
}

// ──────────────────────────────────────────────────────────
// Connexion
// ──────────────────────────────────────────────────────────
export async function loginClient(email: string, password: string) {
  try {

    const { error: tableErr } = await supabaseAdmin.from("clients").select("id").limit(1)
    if (tableErr)
      return {
        success: false,
        error: "La table clients n'existe pas. Veuillez exécuter le script d'initialisation.",
      }


      const { data: client, error } = await supabaseAdmin
      .from("clients")
      .select("id, email, nom_entreprise, mot_de_passe")
      .eq("email", email)
      .single()

    if (error || !client)
      return { success: false, error: "Identifiants incorrects" }


    const isValid = await bcrypt.compare(password, client.mot_de_passe)
    if (!isValid)
      return { success: false, error: "Identifiants incorrects" }


    const session: ClientSession = {
      id: client.id,
      email: client.email,
      entreprise: client.nom_entreprise || "Entreprise",
    }

    const cookieStore = await cookies()
    cookieStore.set("client_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,  // 7 jours
      path: "/",
    })

    return { success: true }
  } catch {
    return { success: false, error: "Une erreur est survenue lors de la connexion" }
  }
}


// ──────────────────────────────────────────────────────────
// Lecture de session
// ──────────────────────────────────────────────────────────
export async function getClientSession(
  cookieStore?: Awaited<ReturnType<typeof cookies>>,
) {
  if (!cookieStore) cookieStore = await cookies()

  const sessionCookie = cookieStore.get("client_session")
  if (!sessionCookie) return null

  try {
    return JSON.parse(sessionCookie.value) as ClientSession
  } catch {
    return null
  }
}

// ──────────────────────────────────────────────────────────
// Déconnexion
// ──────────────────────────────────────────────────────────
export async function logoutClient() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("client_session")
    return { success: true, redirectTo: "/" }
  } catch {
    return { success: false, error: "Erreur lors de la déconnexion" }
  }
}
