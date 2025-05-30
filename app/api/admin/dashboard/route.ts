import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // Récupérer les devis
    const { data: devisData, error: devisError } = await supabaseAdmin
      .from("devis")
      .select("*")
      .order("date_creation", { ascending: false })

    // Récupérer les clients
    const { data: clientsData, error: clientsError } = await supabaseAdmin
      .from("clients")
      .select("*")
      .order("date_creation", { ascending: false })

    // Récupérer les documents
    const { data: documentsData, error: documentsError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .order("date_creation", { ascending: false })

    // Gérer les erreurs
    if (devisError && !devisError.message.includes("does not exist")) {
      console.error("Erreur lors de la récupération des devis:", devisError)
    }

    if (clientsError && !clientsError.message.includes("does not exist")) {
      console.error("Erreur lors de la récupération des clients:", clientsError)
    }

    if (documentsError && !documentsError.message.includes("does not exist")) {
      console.error("Erreur lors de la récupération des documents:", documentsError)
    }

    // Retourner les données (même si certaines sont null en cas d'erreur)
    return NextResponse.json({
      success: true,
      data: {
        devis: devisData || [],
        clients: clientsData || [],
        documents: documentsData || [],
      },
      errors: {
        devis: devisError?.message || null,
        clients: clientsError?.message || null,
        documents: documentsError?.message || null,
      },
    })
  } catch (error) {
    console.error("Exception lors de la récupération des données:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: {
          devis: [],
          clients: [],
          documents: [],
        },
      },
      { status: 500 },
    )
  }
}
