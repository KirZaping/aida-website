"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { updateClientProfile } from "@/app/actions/client-data"

type Profile = {
  id: string
  nom_entreprise: string
  email: string
  telephone?: string
  adresse?: string
  code_postal?: string
  ville?: string
  siret?: string
  forme_juridique?: string
  date_creation?: string
  nom?: string
  prenom?: string
}

interface Props {
  profile: Profile
  clientId: string
}

export function ProfileSection({ profile, clientId }: Props) {
      const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    nom_entreprise: profile.nom_entreprise ?? "",
    email: profile.email,
    telephone: profile.telephone ?? "",
    adresse: profile.adresse ?? "",
    code_postal: profile.code_postal ?? "",
    ville: profile.ville ?? "",
    siret: profile.siret ?? "",
    forme_juridique: profile.forme_juridique ?? "",
    date_creation: profile.date_creation
      ? new Date(profile.date_creation).toISOString().slice(0, 10)
      : "",
    nom: profile.nom ?? "",
    prenom: profile.prenom ?? "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setFormData({
      nom_entreprise: profile.nom_entreprise,
      email: profile.email,
      telephone: profile.telephone ?? "",
      adresse: profile.adresse ?? "",
      code_postal: profile.code_postal ?? "",
      ville: profile.ville ?? "",
      siret: profile.siret ?? "",
      forme_juridique: profile.forme_juridique ?? "",
      date_creation: profile.date_creation
        ? new Date(profile.date_creation).toISOString().slice(0, 10)
        : "",
      nom: profile.nom ?? "",
      prenom: profile.prenom ?? "",
    })
    setIsEditing(false)
  }

  const handleSave = () => {
    startTransition(async () => {
      await updateClientProfile(clientId, {
        nom_entreprise: formData.nom_entreprise,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        code_postal: formData.code_postal,
        ville: formData.ville,
        siret: formData.siret,
        forme_juridique: formData.forme_juridique,
        date_creation: formData.date_creation,
        nom: formData.nom,
        prenom: formData.prenom,
      })
      setIsEditing(false)
            router.refresh()  // ← recharge la page avec les nouvelles données

    })
  }

  return (
    <div className="space-y-6">
      {/* Entête avec bouton Modifier / Annuler / Enregistrer */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profil entreprise</h1>
          <p className="text-muted-foreground">Informations de votre entreprise</p>
        </div>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Modifier</Button>
        )}
      </div>

      {/* Grille des champs (passage input ↔ texte selon isEditing) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations générales */}
        <div className="border rounded p-4 space-y-4">
          <h2 className="font-semibold">Informations générales</h2>

          {/* Raison sociale */}
          <div>
            <label className="block text-sm font-medium">Raison sociale</label>
            {isEditing ? (
              <input
                name="nom_entreprise"
                value={formData.nom_entreprise}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            ) : (
              <p className="mt-1 text-muted-foreground">{profile.nom_entreprise}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            ) : (
              <p className="mt-1 text-muted-foreground">{profile.email}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium">Téléphone</label>
            {isEditing ? (
              <input
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            ) : (
              <p className="mt-1 text-muted-foreground">{profile.telephone ?? "Non renseigné"}</p>
            )}
          </div>

          {/* Adresse / CP / Ville */}
          <div>
            <label className="block text-sm font-medium">Adresse</label>
            {isEditing ? (
              <input
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            ) : (
              <p className="mt-1 text-muted-foreground">{profile.adresse ?? "Non renseigné"}</p>
            )}
            {isEditing ? (
              <div className="mt-2 flex space-x-2">
                <input
                  name="code_postal"
                  placeholder="Code postal"
                  value={formData.code_postal}
                  onChange={handleChange}
                  className="block w-1/2"
                />
                <input
                  name="ville"
                  placeholder="Ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="block w-1/2"
                />
              </div>
            ) : (
              profile.code_postal && (
                <p className="mt-1 text-muted-foreground">
                  {profile.code_postal} {profile.ville}
                </p>
              )
            )}
          </div>
        </div>

        {/* Informations légales */}
        <div className="border rounded p-4 space-y-4">
          <h2 className="font-semibold">Informations légales</h2>

          <div>
            <label className="block text-sm font-medium">SIRET</label>
            {isEditing ? (
              <input
                name="siret"
                value={formData.siret}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            ) : (
              <p className="mt-1 text-muted-foreground">{profile.siret ?? "Non renseigné"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Forme juridique</label>
            {isEditing ? (
              <input
                name="forme_juridique"
                value={formData.forme_juridique}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            ) : (
              <p className="mt-1 text-muted-foreground">{profile.forme_juridique ?? "Non renseigné"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Date de création</label>
            {isEditing ? (
              <input
                type="date"
                name="date_creation"
                value={formData.date_creation}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            ) : (
              <p className="mt-1 text-muted-foreground">
                {profile.date_creation
                  ? new Date(profile.date_creation).toLocaleDateString("fr-FR")
                  : "Non renseignée"}
              </p>
            )}
          </div>
        </div>

        {/* Contact principal */}
        <div className="border rounded p-4 space-y-4 md:col-span-2">
          <h2 className="font-semibold">Contact principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/** Nom **/}
            <div>
              <label className="block text-sm font-medium">Nom</label>
              {isEditing ? (
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              ) : (
                <p className="mt-1 text-muted-foreground">{profile.nom ?? "Non renseigné"}</p>
              )}
            </div>

            {/** Prénom **/}
            <div>
              <label className="block text-sm font-medium">Prénom</label>
              {isEditing ? (
                <input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              ) : (
                <p className="mt-1 text-muted-foreground">{profile.prenom ?? "Non renseigné"}</p>
              )}
            </div>

            {/** Email **/}
            <div>
              <label className="block text-sm font-medium">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              ) : (
                <p className="mt-1 text-muted-foreground">{profile.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
