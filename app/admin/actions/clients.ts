"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getClient(id: string) {
  try {
    const { data, error } = await supabaseAdmin.from("clients").select("*").eq("id", id).single()

    if (error) {
      console.error("Erreur lors de la récupération du client:", error)
      return { error: error.message }
    }

    return { client: data }
  } catch (error) {
    console.error("Exception lors de la récupération du client:", error)
    return { error: "Une erreur est survenue lors de la récupération du client." }
  }
}

export async function addClient(clientData: {
  nom: string
  prenom: string
  email: string
  telephone?: string
  nom_entreprise: string
  adresse?: string
  code_postal?: string
  ville?: string
  pays?: string
  notes?: string
  type: "client" | "prospect" | "partenaire"
  mot_de_passe?: string
}) {
  try {
    // Vérifier si l'email existe déjà
    const { data: existingClient, error: checkError } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("email", clientData.email)
      .maybeSingle()

    if (checkError) {
      console.error("Erreur lors de la vérification de l'email:", checkError)
      return { error: checkError.message }
    }

    if (existingClient) {
      return { error: "Un client avec cet email existe déjà." }
    }

    // Ajouter le client
    const { data, error } = await supabaseAdmin.from("clients").insert([clientData]).select()

    if (error) {
      console.error("Erreur lors de l'ajout du client:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/clients")
    return { success: true, client: data[0] }
  } catch (error) {
    console.error("Exception lors de l'ajout du client:", error)
    return { error: "Une erreur est survenue lors de l'ajout du client." }
  }
}

export async function updateClient(
  id: string,
  clientData: {
    nom?: string
    prenom?: string
    email?: string
    telephone?: string
    nom_entreprise?: string
    adresse?: string
    code_postal?: string
    ville?: string
    pays?: string
    notes?: string
    type?: "client" | "prospect" | "partenaire"
    mot_de_passe?: string
  },
) {
  try {
    // Si l'email est modifié, vérifier s'il existe déjà
    if (clientData.email) {
      const { data: existingClient, error: checkError } = await supabaseAdmin
        .from("clients")
        .select("id")
        .eq("email", clientData.email)
        .neq("id", id)
        .maybeSingle()

      if (checkError) {
        console.error("Erreur lors de la vérification de l'email:", checkError)
        return { error: checkError.message }
      }

      if (existingClient) {
        return { error: "Un autre client avec cet email existe déjà." }
      }
    }

    // Mettre à jour le client
    const { data, error } = await supabaseAdmin.from("clients").update(clientData).eq("id", id).select()

    if (error) {
      console.error("Erreur lors de la mise à jour du client:", error)
      return { error: error.message }
    }

    revalidatePath(`/admin/clients/${id}`)
    revalidatePath("/admin/clients")
    return { success: true, client: data[0] }
  } catch (error) {
    console.error("Exception lors de la mise à jour du client:", error)
    return { error: "Une erreur est survenue lors de la mise à jour du client." }
  }
}

export async function deleteClient(id: string) {
  try {
    const { error } = await supabaseAdmin.from("clients").delete().eq("id", id)

    if (error) {
      console.error("Erreur lors de la suppression du client:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/clients")
    return { success: true }
  } catch (error) {
    console.error("Exception lors de la suppression du client:", error)
    return { error: "Une erreur est survenue lors de la suppression du client." }
  }
}

export async function getClientDocuments(clientId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("client_id", clientId)
      .order("date_creation", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des documents du client:", error)
      return { error: error.message }
    }

    return { documents: data }
  } catch (error) {
    console.error("Exception lors de la récupération des documents du client:", error)
    return { error: "Une erreur est survenue lors de la récupération des documents." }
  }
}

export async function getClientProjects(clientId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("projets")
      .select("*")
      .eq("client_id", clientId)
      .order("date_creation", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des projets du client:", error)
      return { error: error.message }
    }

    return { projects: data }
  } catch (error) {
    console.error("Exception lors de la récupération des projets du client:", error)
    return { error: "Une erreur est survenue lors de la récupération des projets." }
  }
}
