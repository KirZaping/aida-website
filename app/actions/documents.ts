"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { siteConfig } from "@/lib/config"
import { getClientSession } from "./client-auth"

// Fonction pour récupérer tous les documents d'un client
export async function getClientDocuments(clientId?: string) {
  try {
    const cookieStore = cookies()

    // Si aucun ID client n'est fourni, essayer de récupérer la session
    if (!clientId) {
      const session = await getClientSession(cookieStore)
      if (!session) {
        return { documents: null, error: "Non authentifié" }
      }
      clientId = session.id
    }

    // Vérifier si l'ID client est un UUID valide
    if (!isValidUUID(clientId)) {
      return { documents: [], error: "ID client invalide" }
    }

    // Vérifier si la table documents existe
    const { error: tableError } = await supabaseAdmin.from("documents").select("count").limit(1)

    if (tableError) {
      return { documents: [], error: "La table documents n'existe pas. Veuillez exécuter le script d'initialisation." }
    }

    // Récupérer les documents du client depuis Supabase
    const { data, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("client_id", clientId)
      .order("date_creation", { ascending: false })

    if (error) {
      return { documents: [], error: "Impossible de récupérer les documents" }
    }

    return { documents: data, error: null }
  } catch (error) {
    return { documents: [], error: "Une erreur est survenue" }
  }
}

// Fonction pour récupérer un document spécifique
export async function getDocument(documentId: string) {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)

    if (!session) {
      return { document: null, error: "Non authentifié" }
    }

    // Vérifier si l'ID client est un UUID valide
    if (!isValidUUID(session.id)) {
      return { document: null, error: "ID client invalide" }
    }

    // Vérifier si la table documents existe
    const { error: tableError } = await supabaseAdmin.from("documents").select("count").limit(1)

    if (tableError) {
      return { document: null, error: "La table documents n'existe pas. Veuillez exécuter le script d'initialisation." }
    }

    // Récupérer le document depuis Supabase
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
  } catch (error) {
    return { document: null, error: "Une erreur est survenue" }
  }
}

// Fonction pour obtenir l'URL signée d'un document
export async function getDocumentUrl(documentPath: string) {
  try {
    const { data, error } = await supabaseAdmin.storage.from("client-documents").createSignedUrl(documentPath, 60) // URL valide pendant 60 secondes

    if (error) {
      return null
    }

    return data.signedUrl
  } catch (err) {
    return null
  }
}

// Fonction pour créer un lien de partage pour un document
export async function createDocumentShareLink(documentId: string, expirationDays = 7) {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)

    if (!session) {
      return { url: null, error: "Non authentifié" }
    }

    // Vérifier si l'ID client est un UUID valide
    if (!isValidUUID(session.id)) {
      return { url: null, error: "ID client invalide" }
    }

    // Vérifier si la table documents existe
    const { error: tableError } = await supabaseAdmin.from("documents").select("count").limit(1)

    if (tableError) {
      return { url: null, error: "La table documents n'existe pas. Veuillez exécuter le script d'initialisation." }
    }

    // Vérifier que le document appartient au client
    const { data: document, error: docError } = await supabaseAdmin
      .from("documents")
      .select("id, fichier_path")
      .eq("id", documentId)
      .eq("client_id", session.id)
      .single()

    if (docError || !document) {
      return { url: null, error: "Document non trouvé ou accès non autorisé" }
    }

    // Vérifier si la table document_partages existe
    const { error: partageTableError } = await supabaseAdmin.from("document_partages").select("count").limit(1)

    if (partageTableError) {
      return {
        url: null,
        error: "La table document_partages n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    // Générer un token unique
    const token = uuidv4()

    // Calculer la date d'expiration
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + expirationDays)

    // Créer le partage
    const { data, error } = await supabaseAdmin
      .from("document_partages")
      .insert({
        document_id: documentId,
        token,
        date_expiration: expirationDate.toISOString(),
      })
      .select("token")
      .single()

    if (error) {
      return { url: null, error: "Impossible de créer le lien de partage" }
    }

    // Créer l'URL de partage
    const shareUrl = `${siteConfig.url}/documents/partage/${data.token}`

    return { url: shareUrl, token: data.token, error: null }
  } catch (error) {
    return { url: null, error: "Une erreur est survenue" }
  }
}

// Fonction pour marquer un document comme lu
export async function markDocumentAsRead(documentId: string) {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)

    if (!session) {
      return { success: false, error: "Non authentifié" }
    }

    // Vérifier si l'ID client est un UUID valide
    if (!isValidUUID(session.id)) {
      return { success: false, error: "ID client invalide" }
    }

    // Vérifier si la table document_notifications existe
    const { error: tableError } = await supabaseAdmin.from("document_notifications").select("count").limit(1)

    if (tableError) {
      return {
        success: false,
        error: "La table document_notifications n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    // Marquer toutes les notifications liées à ce document comme lues
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
      return { success: false, error: "Impossible de marquer les notifications comme lues" }
    }

    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}

// Fonction pour récupérer les notifications non lues d'un client
export async function getUnreadNotifications() {
  try {
    const cookieStore = cookies()
    const session = await getClientSession(cookieStore)

    if (!session) {
      return { notifications: null, error: "Non authentifié" }
    }

    // Vérifier si l'ID client est un UUID valide
    if (!isValidUUID(session.id)) {
      return { notifications: [], error: "ID client invalide" }
    }

    // Vérifier si la table document_notifications existe
    const { error: tableError } = await supabaseAdmin.from("document_notifications").select("count").limit(1)

    if (tableError) {
      return {
        notifications: [],
        error: "La table document_notifications n'existe pas. Veuillez exécuter le script d'initialisation.",
      }
    }

    // Récupérer les notifications non lues
    const { data, error } = await supabaseAdmin
      .from("document_notifications")
      .select("*")
      .eq("client_id", session.id)
      .eq("est_lu", false)
      .order("date_creation", { ascending: false })

    if (error) {
      return { notifications: [], error: "Impossible de récupérer les notifications" }
    }

    return { notifications: data, error: null }
  } catch (error) {
    return { notifications: [], error: "Une erreur est survenue" }
  }
}

// Fonction pour vérifier si une chaîne est un UUID valide
function isValidUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}
