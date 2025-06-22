"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"

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
    /* Vérifie que la table `clients` existe ─────────────────── */
    const { error: tableError } = await supabaseAdmin
      .from("clients")
      .select("count")
      .limit(1)
    if (tableError)
      return {
        success: false,
        error:
          "La table clients n'existe pas. Veuillez exécuter le script d'initialisation.",
      }

    /* Recherche de l’utilisateur ────────────────────────────── */
    const { data: client, error } = await supabaseAdmin
      .from("clients")
      .select("id, email, nom_entreprise, mot_de_passe")
      .eq("email", email)
      .single()

    if (error || !client || client.mot_de_passe !== password)
      return { success: false, error: "Identifiants incorrects" }

    /* Création de la session ───────────────────────────────── */
    const session: ClientSession = {
      id: client.id,
      email: client.email,
      entreprise: client.nom_entreprise || "Entreprise",
    }

    /* Stockage dans le cookie (async !) ────────────────────── */
    const cookieStore = await cookies()
    cookieStore.set("client_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
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
