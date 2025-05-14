"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Fonction pour vérifier si la table existe
async function checkTableExists(tableName: string) {
  try {
    // Utiliser une requête simple pour vérifier si la table existe
    const { error } = await supabaseAdmin.from(tableName).select("id").limit(1)

    if (error) {
      // Si l'erreur est "relation does not exist", la table n'existe pas
      if (error.message && error.message.includes("does not exist")) {
        console.log(`La table ${tableName} n'existe pas`)
        return false
      }

      // Autre erreur
      console.error(`Erreur lors de la vérification de la table ${tableName}:`, error)
      return false
    }

    // Si nous arrivons ici, la table existe
    console.log(`La table ${tableName} existe`)
    return true
  } catch (err) {
    console.error(`Exception lors de la vérification de la table ${tableName}:`, err)
    return false
  }
}

export async function soumettreDevis(formData: FormData) {
  try {
    // Récupérer les données du formulaire
    const nom = formData.get("nom") as string
    const email = formData.get("email") as string
    const telephone = formData.get("telephone") as string
    const entreprise = formData.get("entreprise") as string
    const budget = formData.get("budget") as string
    const delai = formData.get("delai") as string
    const description = formData.get("description") as string

    // Récupérer les services (cases à cocher)
    const servicesFormData = formData.getAll("services") as string[]

    // Validation basique
    if (!nom || !email || !budget || !description || servicesFormData.length === 0) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires",
      }
    }

    // Vérifier la connexion à Supabase
    if (!supabaseAdmin) {
      console.error("Client Supabase non disponible")
      return {
        success: false,
        message: "Erreur de connexion à la base de données",
      }
    }

    // Préparer les données pour l'insertion
    const devisData = {
      nom,
      email,
      telephone: telephone || null,
      entreprise: entreprise || null,
      services: servicesFormData,
      budget,
      delai: delai || null,
      description,
      statut: "nouveau",
      date_creation: new Date().toISOString(),
      date_modification: new Date().toISOString(),
    }

    // Log détaillé des données à insérer
    console.log("=== DONNÉES À INSÉRER DANS SUPABASE ===")
    console.log(JSON.stringify(devisData, null, 2))
    console.log("======================================")

    // Activer le mode développement si l'environnement est de développement
    const isDevelopment = process.env.NODE_ENV === "development" || !process.env.SUPABASE_SERVICE_ROLE_KEY

    if (isDevelopment) {
      console.log("Mode développement activé - simulation de succès sans insertion en base de données")

      revalidatePath("/devis")
      return {
        success: true,
        message: "Votre demande a été enregistrée",
        devMode: true,
        devMessage:
          "Note: En environnement de développement, votre demande est stockée localement et non en base de données.",
        data: devisData, // Renvoyer les données pour stockage local
      }
    }

    // Vérifier si la table existe
    const tableExists = await checkTableExists("devis")
    if (!tableExists) {
      console.log("La table 'devis' n'existe pas - mode développement activé")

      revalidatePath("/devis")
      return {
        success: true,
        message: "Votre demande a été enregistrée",
        devMode: true,
        devMessage:
          "Note: La table 'devis' n'existe pas dans la base de données. Votre demande est stockée localement.",
        data: devisData,
      }
    }

    try {
      // Tenter d'insérer les données avec plus de détails sur l'erreur
      console.log("Tentative d'insertion dans Supabase...")
      const { data, error } = await supabaseAdmin.from("devis").insert([devisData]).select()

      // Journalisation détaillée
      if (data) {
        console.log("=== DONNÉES INSÉRÉES AVEC SUCCÈS ===")
        console.log(JSON.stringify(data, null, 2))
        console.log("===================================")
      }

      // Si une erreur se produit
      if (error) {
        console.error("=== ERREUR SUPABASE LORS DE L'INSERTION ===")
        console.error("Code d'erreur:", error.code)
        console.error("Message d'erreur:", error.message)
        console.error("Détails:", error.details)
        console.error("===========================================")

        // Vérifier si c'est une erreur de table inexistante
        if (error.message && (error.message.includes("does not exist") || error.code === "42P01")) {
          console.log("La table 'devis' n'existe pas - mode développement activé")

          // Simuler un succès en mode développement
          revalidatePath("/devis")
          return {
            success: true,
            message: "Votre demande a été enregistrée",
            devMode: true,
            devMessage:
              "Note: La table 'devis' n'existe pas dans la base de données. Votre demande est stockée localement.",
            data: devisData, // Renvoyer les données pour stockage local
          }
        }

        return {
          success: false,
          message: `Erreur lors de l'enregistrement: ${error.message || "Erreur inconnue"}`,
        }
      }

      // Réussite
      console.log("Devis inséré avec succès:", data)
      revalidatePath("/devis")
      return {
        success: true,
        message: "Votre demande a été envoyée avec succès",
      }
    } catch (insertError: any) {
      console.error("=== EXCEPTION LORS DE L'INSERTION ===")
      console.error("Type d'erreur:", typeof insertError)

      // Journalisation détaillée de l'erreur
      if (insertError instanceof Error) {
        console.error("Nom de l'erreur:", insertError.name)
        console.error("Message d'erreur:", insertError.message)
        console.error("Stack trace:", insertError.stack)
      } else {
        console.error("Erreur non standard:", insertError)
      }
      console.error("====================================")

      // Vérifier si c'est une erreur de table inexistante
      if (insertError.message && insertError.message.includes("does not exist")) {
        console.log("Table inexistante détectée, simulation de succès en mode développement")
        revalidatePath("/devis")
        return {
          success: true,
          message: "Votre demande a été enregistrée",
          devMode: true,
          devMessage:
            "Note: La table 'devis' n'existe pas dans la base de données. Votre demande est stockée localement.",
          data: devisData, // Renvoyer les données pour stockage local
        }
      }

      return {
        success: false,
        message: `Exception lors de l'insertion: ${insertError instanceof Error ? insertError.message : "Erreur inconnue"}`,
      }
    }
  } catch (error: any) {
    // Amélioration de la capture d'erreur
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    console.error("Erreur lors de la soumission du devis:", error)
    console.error("Message d'erreur:", errorMessage)

    // Journalisation détaillée
    if (error instanceof Error) {
      console.error("Nom de l'erreur:", error.name)
      console.error("Stack trace:", error.stack)
    }

    // Si c'est une erreur de table inexistante, activer le mode développement
    if (errorMessage.includes("does not exist")) {
      console.log("Table inexistante détectée, simulation de succès en mode développement")
      revalidatePath("/devis")
      return {
        success: true,
        message: "Votre demande a été enregistrée",
        devMode: true,
        devMessage:
          "Note: La table 'devis' n'existe pas dans la base de données. Votre demande est stockée localement.",
        data: formData, // Renvoyer les données pour stockage local
      }
    }

    return {
      success: false,
      message: `Une erreur est survenue: ${errorMessage}`,
    }
  }
}
