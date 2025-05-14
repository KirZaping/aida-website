import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Vérifier si les variables essentielles sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Les variables d'environnement Supabase ne sont pas définies correctement")
  console.error(`URL: ${supabaseUrl ? "Définie" : "Non définie"}`)
  console.error(`Clé anonyme: ${supabaseAnonKey ? "Définie" : "Non définie"}`)
  console.error(`Clé de service: ${supabaseServiceKey ? "Définie" : "Non définie"}`)
}

// Options de configuration pour éviter les problèmes de session
const supabaseOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: { "x-application-name": "aida-agency" },
  },
}

// Client pour utilisation côté client (avec clé anonyme)
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key",
  supabaseOptions,
)

// Client pour utilisation côté serveur (avec clé de service pour plus de permissions)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseServiceKey || supabaseAnonKey || "placeholder-key",
  supabaseOptions,
)

// Fonction simplifiée pour vérifier la connexion à Supabase
export async function checkSupabaseConnection() {
  try {
    console.log("Vérification de la connexion Supabase...")

    // Vérifier simplement si nous pouvons nous connecter à Supabase
    // en utilisant la méthode getSession qui est moins susceptible d'échouer
    const { data, error } = await supabaseAdmin.auth.getSession()

    if (error) {
      console.error("Erreur de connexion à Supabase:", error)
      console.error("Code d'erreur:", error.code)
      console.error("Message d'erreur:", error.message)
      console.error("Détails:", error.details)
      return false
    }

    // Si nous arrivons ici, la connexion à Supabase fonctionne
    console.log("Connexion Supabase réussie")
    return true
  } catch (err) {
    console.error("Exception lors de la vérification de la connexion Supabase:", err)
    if (err instanceof Error) {
      console.error("Nom de l'erreur:", err.name)
      console.error("Message d'erreur:", err.message)
      console.error("Stack trace:", err.stack)
    }
    return false
  }
}

// Fonction pour vérifier si une table existe
export async function checkTableExists(tableName: string) {
  try {
    console.log(`Vérification de l'existence de la table ${tableName}...`)

    // Utiliser une requête simple pour vérifier si la table existe
    // Cette approche est plus fiable que d'essayer d'utiliser une fonction RPC
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

// Fonction pour créer la table devis si elle n'existe pas
export async function createDevisTableIfNotExists() {
  try {
    // Cette fonction est un placeholder - dans un environnement réel,
    // vous utiliseriez les migrations Supabase ou une API d'administration
    console.log("Création de table non supportée via l'API JavaScript")
    return false
  } catch (err) {
    console.error("Erreur lors de la création de la table:", err)
    return false
  }
}
