// app/api/collaborateurs/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import { getClientSession } from "@/app/actions/client-auth"

/* ------------------ Validation ------------------ */
const Body = z.object({ email: z.string().email() })

/* ------------------ POST /api/collaborateurs ----- */
export async function POST(req: Request) {
  /* Auth client ---------------------------------------------------------- */
  const session = await getClientSession(cookies())
  if (!session)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  /* Payload -------------------------------------------------------------- */
  const body = await req.json().catch(() => null)
  const parse = Body.safeParse(body)
  if (!parse.success)
    return NextResponse.json({ error: "E-mail invalide" }, { status: 400 })

  const { email } = parse.data

  /* Doublon ? ------------------------------------------------------------ */
  const { data: existing } = await supabaseAdmin
    .from("collaborateurs")
    .select("id")
    .eq("client_id", session.id)
    .eq("email", email)
    .maybeSingle()

  if (existing)
    return NextResponse.json(
      { error: "Ce collaborateur existe déjà" },
      { status: 409 },
    )

  /* 1/ Insertion dans la table collaborateurs ---------------------------- */
  const { error: insertErr } = await supabaseAdmin.from("collaborateurs").insert({
    client_id: session.id,
    email,
  })
  if (insertErr)
    return NextResponse.json(
      { error: "Impossible d’enregistrer le collaborateur" },
      { status: 500 },
    )

  /* 2/ Invitation par e-mail via Supabase Auth --------------------------- */
  // ⚠️ nécessite SUPABASE_SERVICE_ROLE_KEY dans vos variables d’environnement.
  // Supabase enverra un mail « Vous avez été invité », avec un lien magique.
  const { error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    {
      data: { client_id: session.id }, // champ custom stocké dans auth.users
    },
  )

  if (inviteErr) {
    // L’invitation a échoué ? On laisse la ligne dans la table (statut = invité)
    // et on renvoie l’erreur — le front l’affichera.
    return NextResponse.json(
      {
        error:
          "Collaborateur ajouté, mais l’e-mail d’invitation n’a pas pu être envoyé. " +
          "Contactez le support.",
      },
      { status: 202 },
    )
  }

  return NextResponse.json({ ok: true })
}
