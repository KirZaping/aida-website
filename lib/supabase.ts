import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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

// Fonction pour vérifier la connexion à Supabase
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabaseAdmin.auth.getSession()
    return !error
  } catch (err) {
    return false
  }
}

// Fonction pour vérifier si une table existe
export async function checkTableExists(tableName: string) {
  try {
    const { error } = await supabaseAdmin.from(tableName).select("id").limit(1)
    return !error || !error.message.includes("does not exist")
  } catch (err) {
    return false
  }
}

// Fonction pour créer un dossier client s'il n'existe pas déjà
export async function ensureClientFolder(clientId: string) {
  try {
    // Vérifier si le dossier existe en essayant de lister son contenu
    const { data, error } = await supabaseAdmin.storage.from("client-documents").list(`${clientId}/`)

    // Si le dossier n'existe pas, créer un fichier placeholder pour l'initialiser
    if (!data || data.length === 0) {
      const placeholderContent = new Blob(["Dossier client initialisé"], { type: "text/plain" })
      const { error: uploadError } = await supabaseAdmin.storage
        .from("client-documents")
        .upload(`${clientId}/.placeholder`, placeholderContent)

      if (uploadError) {
        return false
      }
    }

    return true
  } catch (err) {
    return false
  }
}
