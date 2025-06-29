"use server"

import { siteConfig } from "@/lib/config"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function generateShareLink(documentId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data, error } = await supabase
      .from("document_shares")
      .insert({
        document_id: documentId,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
      })
      .select("token")
      .single()

    if (error) throw error

    const shareUrl = `${siteConfig.url}/documents/share/${data.token}`

    return { success: true, url: shareUrl }
  } catch (error) {
    console.error("Erreur lors de la génération du lien de partage:", error)
    return { success: false, error: "Impossible de générer le lien de partage" }
  }
}

export async function isDocumentShareable(documentId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data: session } = await supabase.auth.getSession()

    if (!session.session?.user?.id) {
      return { shareable: false, reason: "Non authentifié" }
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("client_id", session.session.user.id)
      .single()

    if (error || !data) {
      return { shareable: false, reason: "Document non trouvé ou accès non autorisé" }
    }

    return { shareable: true }
  } catch (error) {
    console.error("Erreur lors de la vérification du document:", error)
    return { shareable: false, reason: "Erreur lors de la vérification" }
  }
}
