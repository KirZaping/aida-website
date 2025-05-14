export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      devis: {
        Row: {
          id: string
          nom: string
          email: string
          telephone: string | null
          entreprise: string | null
          services: string[]
          budget: string
          delai: string | null
          description: string
          statut: string
          date_creation: string
          date_modification: string
        }
        Insert: {
          id?: string
          nom: string
          email: string
          telephone?: string | null
          entreprise?: string | null
          services: string[]
          budget: string
          delai?: string | null
          description: string
          statut?: string
          date_creation?: string
          date_modification?: string
        }
        Update: {
          id?: string
          nom?: string
          email?: string
          telephone?: string | null
          entreprise?: string | null
          services?: string[]
          budget?: string
          delai?: string | null
          description?: string
          statut?: string
          date_creation?: string
          date_modification?: string
        }
      }
      contacts: {
        Row: {
          id: string
          nom: string
          email: string
          sujet: string
          message: string
          lu: boolean
          date_creation: string
        }
        Insert: {
          id?: string
          nom: string
          email: string
          sujet: string
          message: string
          lu?: boolean
          date_creation?: string
        }
        Update: {
          id?: string
          nom?: string
          email?: string
          sujet?: string
          message?: string
          lu?: boolean
          date_creation?: string
        }
      }
      newsletter: {
        Row: {
          id: string
          email: string
          date_inscription: string
          actif: boolean
        }
        Insert: {
          id?: string
          email: string
          date_inscription?: string
          actif?: boolean
        }
        Update: {
          id?: string
          email?: string
          date_inscription?: string
          actif?: boolean
        }
      }
    }
  }
}
