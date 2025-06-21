"use server"
import { supabaseAdmin } from "@/lib/supabase"

// Fonction pour récupérer le profil d'un client
export async function getClientProfile(clientId: string) {
  try {
    // Vérifier si l'ID est valide
    if (!clientId || clientId.trim() === "") {
      return { profile: null, error: "ID client non valide" }
    }

    // Récupérer le profil du client
    const { data, error } = await supabaseAdmin.from("clients").select("*").eq("id", clientId).single()

    if (error) {
      console.error("Erreur lors de la récupération du profil:", error)
      return { profile: null, error: "Impossible de récupérer le profil" }
    }

    return { profile: data, error: null }
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return { profile: null, error: "Une erreur est survenue" }
  }
}

// Fonction pour récupérer les projets d'un client
export async function getClientProjects(clientId: string) {
  try {
    // Vérifier si l'ID est valide
    if (!clientId || clientId.trim() === "") {
      return { projects: [], error: "ID client non valide" }
    }

    // Vérifier si la table projets existe
    const { error: tableError } = await supabaseAdmin.from("projets").select("id").limit(1)

    if (tableError) {
      console.error("Erreur de vérification de la table projets:", tableError)

      // Si la table n'existe pas, retourner un tableau vide
      return { projects: [], error: "La table projets n'existe pas encore" }
    }

    // Récupérer les projets du client
    const { data, error } = await supabaseAdmin
      .from("projets")
      .select("*")
      .eq("client_id", clientId)
      .order("date_creation", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des projets:", error)
      return { projects: [], error: "Impossible de récupérer les projets" }
    }

    return { projects: data || [], error: null }
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error)
    return { projects: [], error: "Une erreur est survenue" }
  }
}

// Fonction pour récupérer les factures d'un client
export async function getClientInvoices(clientId: string) {
  try {
    // Vérifier si l'ID est valide
    if (!clientId || clientId.trim() === "") {
      return { invoices: [], error: "ID client non valide" }
    }

    // Vérifier si la table documents existe
    const { error: tableError } = await supabaseAdmin.from("documents").select("id").limit(1)

    if (tableError) {
      console.error("Erreur de vérification de la table documents:", tableError)

      // Si la table n'existe pas, retourner un tableau vide
      return { invoices: [], error: "La table documents n'existe pas encore" }
    }

    // Récupérer les factures du client
    const { data, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("client_id", clientId)
      .eq("type", "facture")
      .order("date_creation", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des factures:", error)
      return { invoices: [], error: "Impossible de récupérer les factures" }
    }

    return { invoices: data || [], error: null }
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error)
    return { invoices: [], error: "Une erreur est survenue" }
  }
}

// Fonction pour mettre à jour le profil d'un client
export async function updateClientProfile(clientId: string, profileData: any) {
  try {
    // Vérifier si l'ID est valide
    if (!clientId || clientId.trim() === "") {
      return { success: false, error: "ID client non valide" }
    }

    // Mettre à jour le profil du client
    const { error } = await supabaseAdmin.from("clients").update(profileData).eq("id", clientId)

    if (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      return { success: false, error: "Impossible de mettre à jour le profil" }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return { success: false, error: "Une erreur est survenue" }
  }
}




export async function getClientCollaborators(clientId: string) {
  try {
    if (!clientId || clientId.trim() === "") {
      return { collaborators: [], error: "ID client non valide" }
    }

    // Vérifier que la table existe
    const { error: tableError } = await supabaseAdmin
      .from("collaborateurs")
      .select("id")
      .limit(1)
    if (tableError) {
      console.error("Table collaborateurs inexistante:", tableError)
      return { collaborators: [], error: "La table collaborateurs n'existe pas" }
    }

    // Récupérer les collaborateurs
    const { data, error } = await supabaseAdmin
      .from("collaborateurs")
      .select("id, client_id, email, date_invitation, statut_invitation")
      .eq("client_id", clientId)
      .order("date_invitation", { ascending: false })

    if (error) {
      console.error("Erreur récupération collaborateurs:", error)
      return { collaborators: [], error: "Impossible de récupérer les collaborateurs" }
    }

    return { collaborators: data || [], error: null }
  } catch (err) {
    console.error("Erreur getClientCollaborators:", err)
    return { collaborators: [], error: "Une erreur est survenue" }
  }
}


export async function deleteCollaborator(collaboratorId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("collaborateurs")
      .delete()
      .eq("id", collaboratorId)

    if (error) {
      console.error("Erreur suppression collaborateur:", error)
      return { success: false, error: "Impossible de supprimer le collaborateur" }
    }
    return { success: true, error: null }
  } catch (err) {
    console.error("deleteCollaborator:", err)
    return { success: false, error: "Une erreur est survenue" }
  }
}

