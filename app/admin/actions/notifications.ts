"use server"

import { siteConfig } from "@/lib/config"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"

// Envoyer une notification par email à un client
export async function sendEmailNotification(clientId: string, subject: string, message: string, documentId?: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Récupérer les informations du client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("email, nom, prenom")
      .eq("id", clientId)
      .single()

    if (clientError || !client) {
      throw new Error("Client non trouvé")
    }

    // Construire l'URL du document si fourni
    let documentUrl = ""
    if (documentId) {
      documentUrl = `${siteConfig.url}/espace-client/documents/${documentId}`
    }

    // Envoyer l'email via Supabase Edge Functions ou un service tiers
    // Ceci est un exemple, l'implémentation réelle dépendra de votre service d'emails
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: {
        to: client.email,
        subject,
        message,
        documentUrl,
        clientName: `${client.prenom} ${client.nom}`,
        siteUrl: siteConfig.url,
      },
    })

    if (error) throw error

    // Enregistrer la notification dans la base de données
    await supabase.from("notifications").insert({
      client_id: clientId,
      subject,
      message,
      document_id: documentId,
    })

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification:", error)
    return { success: false, error: "Impossible d'envoyer la notification" }
  }
}
