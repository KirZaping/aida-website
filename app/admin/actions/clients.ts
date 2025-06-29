"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

import bcrypt from "bcryptjs"


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
  mot_de_passe?: string                 // mot de passe en clair (formulaire)
}) {
  try {
    /* --------- email déjà utilisé ? ------------------------------------ */
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("email", clientData.email)
      .maybeSingle()

    if (checkErr) return { error: checkErr.message }
    if (existing)  return { error: "Un client avec cet email existe déjà." }

    /* --------- hash du mot de passe ------------------------------------ */
    let hashed = ""
    if (clientData.mot_de_passe) {
      // 12 rounds → bon compromis sécurité <-> perf
      hashed = await bcrypt.hash(clientData.mot_de_passe, 12)
    }

    /* --------- insertion ------------------------------------------------ */
    const { data, error } = await supabaseAdmin
      .from("clients")
      .insert([
        {
          ...clientData,
          mot_de_passe: hashed,          // on stocke uniquement le hash
        },
      ])
      .select()

    if (error) return { error: error.message }

    revalidatePath("/admin/clients")
    return { success: true, client: data[0] }
  } catch (err) {
    console.error("Exception lors de l'ajout du client:", err)
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
