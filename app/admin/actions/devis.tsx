"use server"

import { supabaseAdmin } from "@/lib/supabase"

export async function updateDevisStatus(id: string, statut: string) {
  const { error } = await supabaseAdmin
    .from("devis")
    .update({ statut, date_modification: new Date().toISOString() })
    .eq("id", id)



  if (error) throw new Error(error.message)
}
