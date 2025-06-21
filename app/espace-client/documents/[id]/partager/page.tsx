// app/documents/partage/[token]/page.tsx
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { getDocumentByShareToken, getDocumentUrl } from "@/app/actions/documents"

interface PageProps {
  params: { token: string }
}

export default async function SharedDocumentPage({ params }: PageProps) {
  const { token } = params

  // 1️⃣ Récupère le document associé au token
  const document = await getDocumentByShareToken(token)
  if (!document) {
    // token invalide ou expiré
    notFound()
  }

  // 2️⃣ Génère l'URL signée pour le téléchargement ou l'affichage
  const url = document.fichier_path
    ? await getDocumentUrl(document.fichier_path)
    : null

  if (!url) {
    notFound()
  }

  // 3️⃣ Redirige vers l'URL du fichier (le navigateur lancera le téléchargement si `Content-Disposition: attachment` est géré côté stockage)
  return redirect(url)
}
