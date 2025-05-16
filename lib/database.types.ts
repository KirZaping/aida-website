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
      documents: {
        Row: {
          id: string
          client_id: string
          titre: string
          description: string | null
          type: string
          statut: string
          montant: number | null
          fichier_path: string | null
          fichier_nom: string | null
          fichier_type: string | null
          fichier_taille: number | null
          date_creation: string
          date_modification: string
        }
        Insert: {
          id?: string
          client_id: string
          titre: string
          description?: string | null
          type: string
          statut: string
          montant?: number | null
          fichier_path?: string | null
          fichier_nom?: string | null
          fichier_type?: string | null
          fichier_taille?: number | null
          date_creation?: string
          date_modification?: string
        }
        Update: {
          id?: string
          client_id?: string
          titre?: string
          description?: string | null
          type?: string
          statut?: string
          montant?: number | null
          fichier_path?: string | null
          fichier_nom?: string | null
          fichier_type?: string | null
          fichier_taille?: number | null
          date_creation?: string
          date_modification?: string
        }
      }
      document_partages: {
        Row: {
          id: string
          document_id: string
          token: string
          email_destinataire: string | null
          date_creation: string
          date_expiration: string
          est_consulte: boolean
          date_consultation: string | null
        }
        Insert: {
          id?: string
          document_id: string
          token: string
          email_destinataire?: string | null
          date_creation?: string
          date_expiration: string
          est_consulte?: boolean
          date_consultation?: string | null
        }
        Update: {
          id?: string
          document_id?: string
          token?: string
          email_destinataire?: string | null
          date_creation?: string
          date_expiration?: string
          est_consulte?: boolean
          date_consultation?: string | null
        }
      }
      document_notifications: {
        Row: {
          id: string
          document_id: string
          client_id: string
          type: string
          message: string
          est_lu: boolean
          date_creation: string
          date_lecture: string | null
        }
        Insert: {
          id?: string
          document_id: string
          client_id: string
          type: string
          message: string
          est_lu?: boolean
          date_creation?: string
          date_lecture?: string | null
        }
        Update: {
          id?: string
          document_id?: string
          client_id?: string
          type?: string
          message?: string
          est_lu?: boolean
          date_creation?: string
          date_lecture?: string | null
        }
      }
    }
  }
}
