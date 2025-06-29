"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"

import bcrypt from "bcryptjs"


export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  if (!username || !password)
    return { success: false, error: "Nom d'utilisateur ou mot de passe manquant" }

  try {
    /* ── 1· récupérer l’admin (le mot de passe stocké est déjà un hash bcrypt) */
    const { data: admin, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, role, password")      // la colonne contient désormais le hash
      .eq("username", username)
      .single()

    if (error || !admin) return { success: false, error: "Identifiants incorrects" }

    /* ── 2· comparer le mot de passe avec bcrypt ------------------------- */
    const ok = await bcrypt.compare(password, admin.password)
    if (!ok) return { success: false, error: "Identifiants incorrects" }

    /* ── 3· mettre à jour last_login ------------------------------------ */
    await supabaseAdmin
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", admin.id)

    /* ── 4· créer le cookie de session sécurisée ------------------------ */
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 h
    const session: AdminSession = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      expires: expires.toISOString(),
    }

    cookies().set("admin_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires,
    })

    return { success: true, user: { username: admin.username, role: admin.role } }
  } catch (e) {
    console.error("Erreur login admin :", e)
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
