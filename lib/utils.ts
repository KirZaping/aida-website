import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate une date en format français
 * @param date Date à formater (string ou Date)
 * @param formatStr Format de date (par défaut: 'dd/MM/yyyy')
 * @returns Date formatée en string
 */
export function formatDate(date: string | Date | null | undefined, formatStr = "dd/MM/yyyy"): string {
  if (!date) return "Date inconnue"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return format(dateObj, formatStr, { locale: fr })
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error)
    return "Date invalide"
  }
}

/**
 * Formate une taille de fichier en KB, MB, GB, etc.
 * @param bytes Taille en octets
 * @returns Taille formatée avec unité
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
