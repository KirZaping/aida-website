"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface ShareDocumentFormProps {
  documentId: string
  documentTitle: string
  shareUrl: string | null
}

export function ShareDocumentForm({ documentId, documentTitle, shareUrl }: ShareDocumentFormProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(
    `Bonjour,\n\nVoici le document "${documentTitle}" que je souhaite partager avec vous.\n\nCordialement,`,
  )
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse email",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simuler l'envoi d'email (à remplacer par un appel API réel)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Email envoyé",
        description: `Le document a été envoyé à ${email}`,
      })

      setEmail("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email du destinataire</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !shareUrl}>
        <Mail className="mr-2 h-4 w-4" />
        {isLoading ? "Envoi en cours..." : "Envoyer par email"}
      </Button>
    </form>
  )
}
