"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"

// Type pour la session client
export type ClientSession = {
  id: string
  email: string
  entreprise: string
}

// Fonction pour se connecter
export async function loginClient(email: string, password: string) {
  try {
    // Vérifier si la table clients existe
    const { error: tableError } = await supabaseAdmin.from("clients").select("count").limit(1)

    if (tableError) {
      console.error("Erreur lors de la vérification de la table clients:", tableError)
      return { success: false, error: "La table clients n'existe pas. Veuillez exécuter le script d'initialisation." }
    }

    // Authentification avec Supabase
    const { data: client, error } = await supabaseAdmin
      .from("clients")
      .select("id, email, nom_entreprise, mot_de_passe")
      .eq("email", email)
      .single()

    if (error || !client) {
      console.error("Erreur lors de la recherche du client:", error)
      return { success: false, error: "Identifiants incorrects" }
    }

    // Vérification du mot de passe
    if (client.mot_de_passe !== password) {
      return { success: false, error: "Identifiants incorrects" }
    }

    // Créer la session
    const session: ClientSession = {
      id: client.id,
      email: client.email,
      entreprise: client.nom_entreprise || "Entreprise",
    }

    // Stocker la session dans un cookie
    cookies().set("client_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return { success: false, error: "Une erreur est survenue lors de la connexion" }
  }
}

// Fonction pour récupérer la session
export async function getClientSession(cookieStore: ReturnType<typeof cookies>) {
  const sessionCookie = cookieStore.get("client_session")
  if (!sessionCookie) return null

  try {
    return JSON.parse(sessionCookie.value) as ClientSession
  } catch {
    return null
  }
}

// Fonction pour se déconnecter
export async function logoutClient() {
  try {
    cookies().delete("client_session")
    return { success: true, redirectTo: "/" }
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    return { success: false, error: "Erreur lors de la déconnexion" }
  }
}
