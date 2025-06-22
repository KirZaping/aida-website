// actions/getRecentActivity.ts
import { supabaseAdmin } from "@/lib/supabase"

export async function getRecentActivity(limit = 10) {
  const { data: devis } = await supabaseAdmin
    .from("devis")
    .select("id, nom, date_creation")
    .order("date_creation", { ascending: false })
    .limit(limit)

  const { data: clients } = await supabaseAdmin
    .from("clients")
    .select("id, nom, date_creation")
    .order("date_creation", { ascending: false })
    .limit(limit)

  const { data: documents } = await supabaseAdmin
    .from("documents")
    .select("id, titre, date_creation")
    .order("date_creation", { ascending: false })
    .limit(limit)

  const activities = [
    ...(devis || []).map((d) => ({ id: d.id, type: "devis", label: d.nom, date_creation: d.date_creation })),
    ...(clients || []).map((c) => ({ id: c.id, type: "client", label: c.nom, date_creation: c.date_creation })),
    ...(documents || []).map((doc) => ({
      id: doc.id,
      type: "document",
      label: doc.titre,
      date_creation: doc.date_creation,
    })),
  ]

  return activities
    .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
    .slice(0, limit)
}
