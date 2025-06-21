// app/espace-client/documents/page.tsx
import { cookies } from "next/headers"
import { getClientSession } from "@/app/actions/client-auth"
import { getClientDocuments } from "@/app/actions/documents"
import DocumentBrowser from "../components/document-browser"

export default async function DocumentsPage() {
  const cookieStore = cookies()
  const session = await getClientSession(cookieStore)

  // Le layout se charge de la redirection si la session est absente
  if (!session) return null

  const { documents = [], error } = await getClientDocuments(session.id)

  return (
    <DocumentBrowser
      documents={documents}
      error={error}
    />
  )
}
