"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  document_id: string
  type: string
  message: string
  date_creation: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simuler un appel API pour récupérer les notifications
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // En mode démo, utiliser des données fictives
        const demoNotifications = [
          {
            id: "1",
            document_id: "5",
            type: "nouveau_document",
            message: "Une nouvelle facture a été ajoutée à votre espace client",
            date_creation: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            document_id: "3",
            type: "rappel",
            message: "Rappel : Votre facture #2023-002 est en attente de paiement",
            date_creation: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
        ]

        setNotifications(demoNotifications)
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    }
  }

  const markAsRead = async (id: string) => {
    // Simuler un appel API pour marquer la notification comme lue
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              variant="destructive"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Chargement des notifications...</div>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="cursor-pointer flex flex-col items-start p-3">
                <div className="flex justify-between w-full">
                  <span className="font-medium">
                    {notification.type === "nouveau_document" ? "Nouveau document" : "Rappel"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(notification.date_creation)}</span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
                <div className="flex justify-between w-full mt-2">
                  <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                    <Link href={`/espace-client/documents/${notification.document_id}`}>Voir le document</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-xs text-muted-foreground"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Marquer comme lu
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center" asChild>
              <Link href="/espace-client/notifications" className="w-full text-center">
                Voir toutes les notifications
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">Aucune nouvelle notification</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
