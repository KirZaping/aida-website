"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { getClientSession } from "./client-auth"

// ────────────────────────────────────────────────────────────
// Constantes
// ────────────────────────────────────────────────────────────

const BUCKET = "client-documents"
const SIGNED_URL_TTL = 60

// ────────────────────────────────────────────────────────────
// Documents du client
// ────────────────────────────────────────────────────────────

export async function getClientDocuments(clientId?: string) {
  try {
    const cookieStore = cookies()

    if (!clientId) {
      const session = await getClientSession(cookieStore)
      if (!session) return { documents: null, error: "Non authentifié" }
      clientId = session.id
    }

    if (!isValidUUID(clientId)) {
      return { documents: [], error: "ID client invalide" }
    }

    const { error: tableError } = await supabaseAdmin
      .from("documents")
      .select("count")
      .limit(1)
    if (tableError) {
      return {
        documents: [],
        error:
          "La table documents n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    const { data, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("client_id", clientId)
      .order("date_creation", { ascending: false })

    if (error) {
      return { documents: [], error: "Impossible de récupérer les documents" }
    }

    return { documents: data, error: null }
  } catch {
    return { documents: [], error: "Une erreur est survenue" }
  }
}

// ────────────────────────────────────────────────────────────
// Document unique
// ────────────────────────────────────────────────────────────

export async function getDocument(documentId: string) {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)
    if (!session) return { document: null, error: "Non authentifié" }

    if (!isValidUUID(session.id)) {
      return { document: null, error: "ID client invalide" }
    }

    const { error: tableError } = await supabaseAdmin
      .from("documents")
      .select("count")
      .limit(1)
    if (tableError) {
      return {
        document: null,
        error:
          "La table documents n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    const { data, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("client_id", session.id)
      .single()

    if (error) {
      return { document: null, error: "Document non trouvé ou accès non autorisé" }
    }

    return { document: data, error: null }
  } catch {
    return { document: null, error: "Une erreur est survenue" }
  }
}

// ────────────────────────────────────────────────────────────
// URL signée (aperçu / téléchargement)
// ────────────────────────────────────────────────────────────

export async function getDocumentUrl(documentPath: string) {
  try {
    // On retire le nom du bucket s'il est dupliqué
    const cleanedPath = documentPath.replace(new RegExp(`^${BUCKET}/`), "")

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(cleanedPath, SIGNED_URL_TTL)

    if (error) return null
    return data.signedUrl
  } catch {
    return null
  }
}

// ────────────────────────────────────────────────────────────
// Lien de partage (URL signée longue durée) : KO
// ────────────────────────────────────────────────────────────

export async function createDocumentShareLink(
  documentId: string,
  expirationDays = 7,
) {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)
    if (!session) return { url: null, error: "Non authentifié" }

    if (!isValidUUID(session.id)) {
      return { url: null, error: "ID client invalide" }
    }

    const { error: tableError } = await supabaseAdmin
      .from("documents")
      .select("count")
      .limit(1)
    if (tableError) {
      return {
        url: null,
        error:
          "La table documents n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    const { data: doc, error: docErr } = await supabaseAdmin
      .from("documents")
      .select("fichier_path")
      .eq("id", documentId)
      .eq("client_id", session.id)
      .single()
    if (docErr || !doc) {
      return { url: null, error: "Document non trouvé ou accès non autorisé" }
    }

    const { error: partTableErr } = await supabaseAdmin
      .from("document_partages")
      .select("count")
      .limit(1)
    if (partTableErr) {
      return {
        url: null,
        error:
          "La table document_partages n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    const token = uuidv4()
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + expirationDays)

    await supabaseAdmin.from("document_partages").insert({
      document_id: documentId,
      token,
      date_expiration: expiration.toISOString(),
    })

    const pathInBucket = doc.fichier_path.replace(new RegExp(`^${BUCKET}/`), "")
    const expiresIn = expirationDays * 24 * 60 * 60

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(pathInBucket, expiresIn)

    return {
      url: signed?.signedUrl || null,
      token,
      error: signErr?.message || null,
    }
  } catch {
    return { url: null, error: "Une erreur est survenue" }
  }
}

// ────────────────────────────────────────────────────────────
// Marquer un document comme lu : KO
// ────────────────────────────────────────────────────────────

export async function markDocumentAsRead(documentId: string) {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)
    if (!session) return { success: false, error: "Non authentifié" }

    if (!isValidUUID(session.id)) {
      return { success: false, error: "ID client invalide" }
    }

    const { error: tableError } = await supabaseAdmin
      .from("document_notifications")
      .select("count")
      .limit(1)
    if (tableError) {
      return {
        success: false,
        error:
          "La table document_notifications n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    const { error } = await supabaseAdmin
      .from("document_notifications")
      .update({
        est_lu: true,
        date_lecture: new Date().toISOString(),
      })
      .eq("document_id", documentId)
      .eq("client_id", session.id)
      .eq("est_lu", false)

    if (error) {
      return { success: false, error: "Impossible de marquer comme lu" }
    }
    return { success: true, error: null }
  } catch {
    return { success: false, error: "Une erreur est survenue" }
  }
}

// ────────────────────────────────────────────────────────────
// Notifications non lues : KO
// ────────────────────────────────────────────────────────────

export async function getUnreadNotifications() {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)
    if (!session) return { notifications: null, error: "Non authentifié" }

    if (!isValidUUID(session.id)) {
      return { notifications: [], error: "ID client invalide" }
    }

    const { error: tableError } = await supabaseAdmin
      .from("document_notifications")
      .select("count")
      .limit(1)
    if (tableError) {
      return {
        notifications: [],
        error:
          "La table document_notifications n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    const { data, error } = await supabaseAdmin
      .from("document_notifications")
      .select("*")
      .eq("client_id", session.id)
      .eq("est_lu", false)
      .order("date_creation", { ascending: false })

    if (error) {
      return { notifications: [], error: "Impossible de récupérer" }
    }
    return { notifications: data, error: null }
  } catch {
    return { notifications: [], error: "Une erreur est survenue" }
  }
}

// ────────────────────────────────────────────────────────────
// Utils
// ────────────────────────────────────────────────────────────

function isValidUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str,
  )
}
