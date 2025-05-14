"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PenTool, ArrowLeft, ArrowRight, Check, Send, AlertCircle, Info } from "lucide-react"
import { soumettreDevis } from "@/app/actions/devis"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Ajouter l'import pour localStorage
// import { useEffect } from "react"; // Removed duplicate import

export default function DevisPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    entreprise: "",
    budget: "",
    delai: "",
    services: [] as string[],
    description: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [devMode, setDevMode] = useState(false)

  // Si le paramètre success est présent, afficher l'étape de confirmation
  useEffect(() => {
    if (success === "true") {
      setStep(5)
    }
  }, [success])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const services = [...prev.services]
      if (services.includes(service)) {
        return { ...prev, services: services.filter((s) => s !== service) }
      } else {
        return { ...prev, services: [...services, service] }
      }
    })
  }

  const handleBudgetChange = (value: string) => {
    setFormData((prev) => ({ ...prev, budget: value }))
  }

  const handleDelaiChange = (value: string) => {
    setFormData((prev) => ({ ...prev, delai: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const validateStep1 = () => {
    if (!formData.nom || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires")
      return false
    }
    setError(null)
    return true
  }

  const validateStep2 = () => {
    if (formData.services.length === 0 || !formData.budget) {
      setError("Veuillez sélectionner au moins un service et indiquer votre budget")
      return false
    }
    setError(null)
    return true
  }

  const validateStep3 = () => {
    if (!formData.description) {
      setError("Veuillez décrire votre projet")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep3()) return

    // Passer à l'étape de confirmation sans envoyer le formulaire
    nextStep()
  }

  // Remplacer la fonction submitFinalForm par cette version améliorée
  const submitFinalForm = async () => {
    try {
      setIsSubmitting(true)
      setError(null)
      setWarning(null)
      setDevMode(false)

      // Créer un FormData avec toutes les données du formulaire
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("nom", formData.nom)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("telephone", formData.telephone || "")
      formDataToSubmit.append("entreprise", formData.entreprise || "")
      formDataToSubmit.append("budget", formData.budget)
      formDataToSubmit.append("delai", formData.delai || "")
      formDataToSubmit.append("description", formData.description)

      // Ajouter les services
      formData.services.forEach((service) => {
        formDataToSubmit.append("services", service)
      })

      console.log("Envoi du formulaire...")

      try {
        // Soumettre le formulaire via Server Action
        const result = await soumettreDevis(formDataToSubmit)
        console.log("Résultat de la soumission:", result)

        if (result.success) {
          // Vérifier si nous sommes en mode développement
          if (result.devMode) {
            setDevMode(true)
            setWarning(
              result.devMessage || "Mode développement: Les données ne sont pas enregistrées en base de données.",
            )

            // Stocker les données dans localStorage pour le mode développement
            if (result.data) {
              try {
                const localData = {
                  ...result.data,
                  id: `local-${Date.now()}`,
                  date_creation: new Date().toISOString(),
                }

                // Récupérer les demandes existantes
                const existingDevis = JSON.parse(localStorage.getItem("localDevis") || "[]")
                existingDevis.push(localData)

                // Sauvegarder dans localStorage
                localStorage.setItem("localDevis", JSON.stringify(existingDevis))
                console.log("Données stockées localement:", localData)
              } catch (storageError) {
                console.error("Erreur lors du stockage local:", storageError)
              }
            }
          }

          // Passer à l'étape de succès
          setStep(5)
        } else {
          setError(result.message || "Une erreur est survenue lors de l'envoi de votre demande.")
        }
      } catch (submitError) {
        console.error("Erreur lors de la soumission:", submitError)

        // Tenter de stocker localement en cas d'erreur
        try {
          const localData = {
            nom: formData.nom,
            email: formData.email,
            telephone: formData.telephone || null,
            entreprise: formData.entreprise || null,
            services: formData.services,
            budget: formData.budget,
            delai: formData.delai || null,
            description: formData.description,
            id: `local-${Date.now()}`,
            date_creation: new Date().toISOString(),
            error_backup: true,
          }

          // Récupérer les demandes existantes
          const existingDevis = JSON.parse(localStorage.getItem("localDevis") || "[]")
          existingDevis.push(localData)

          // Sauvegarder dans localStorage
          localStorage.setItem("localDevis", JSON.stringify(existingDevis))

          setDevMode(true)
          setWarning("La demande n'a pas pu être envoyée au serveur, mais elle a été sauvegardée localement.")
          setStep(5)
          return
        } catch (storageError) {
          console.error("Erreur lors du stockage local:", storageError)
        }

        setError(
          submitError instanceof Error
            ? `Erreur: ${submitError.message}`
            : "Une erreur inattendue est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        )
      }
    } catch (error) {
      console.error("Exception lors de la soumission du devis:", error)

      // Tenter de stocker localement en cas d'erreur
      try {
        const localData = {
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone || null,
          entreprise: formData.entreprise || null,
          services: formData.services,
          budget: formData.budget,
          delai: formData.delai || null,
          description: formData.description,
          id: `local-${Date.now()}`,
          date_creation: new Date().toISOString(),
          error_backup: true,
        }

        // Récupérer les demandes existantes
        const existingDevis = JSON.parse(localStorage.getItem("localDevis") || "[]")
        existingDevis.push(localData)

        // Sauvegarder dans localStorage
        localStorage.setItem("localDevis", JSON.stringify(existingDevis))

        setDevMode(true)
        setWarning("La demande n'a pas pu être envoyée au serveur, mais elle a été sauvegardée localement.")
        setStep(5)
        return
      } catch (storageError) {
        console.error("Erreur lors du stockage local:", storageError)
      }

      setError(
        error instanceof Error
          ? `Erreur: ${error.message}`
          : "Une erreur inattendue est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ajouter cette fonction pour récupérer les demandes locales
  const getLocalDevis = () => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("localDevis") || "[]")
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes locales:", error)
      return []
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <PenTool className="h-6 w-6 text-blue-600" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl font-bold text-gradient"
            >
              AIDA
            </motion.span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </motion.header>

      <main className="flex-1 bg-blue-gradient/30">
        <div className="container max-w-4xl py-12 px-4 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Demandez un <span className="text-gradient">devis personnalisé</span>
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Parlez-nous de votre projet et nous vous contacterons rapidement avec une proposition adaptée à vos
              besoins.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step === i
                        ? "border-blue-600 bg-blue-600 text-white"
                        : step > i
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {step > i ? <Check className="h-5 w-5" /> : i}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${step >= i ? "text-blue-600" : "text-gray-400"}`}>
                    {i === 1
                      ? "Informations"
                      : i === 2
                        ? "Projet"
                        : i === 3
                          ? "Détails"
                          : i === 4
                            ? "Confirmation"
                            : "Succès"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-4">
              <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
              <motion.div
                className="absolute top-0 h-1 bg-blue-600 rounded"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </motion.div>

          {/* Message d'erreur */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Message d'avertissement */}
          {warning && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="default" className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-700">{warning}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Step 1: Informations personnelles */}
          {step === 1 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="mb-6 text-2xl font-bold">Vos informations</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (validateStep1()) nextStep()
                }}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com"
                      required
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Votre numéro de téléphone"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entreprise">Entreprise</Label>
                    <Input
                      id="entreprise"
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleChange}
                      placeholder="Nom de votre entreprise"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="btn-gradient text-white">
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Type de projet et services */}
          {step === 2 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="mb-6 text-2xl font-bold">Votre projet</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (validateStep2()) nextStep()
                }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label className="text-base">Services requis *</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      "Design Graphique",
                      "Web & Digital",
                      "Stratégie de Marque",
                      "Marketing Digital",
                      "Relations Presse",
                      "Événementiel",
                    ].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          name="services"
                          value={service}
                          checked={formData.services.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <Label htmlFor={service} className="font-normal">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Budget estimé *</Label>
                  <RadioGroup
                    value={formData.budget}
                    onValueChange={handleBudgetChange}
                    className="grid gap-4 md:grid-cols-2"
                    name="budget"
                  >
                    {[
                      { value: "moins-5k", label: "Moins de 5 000 €" },
                      { value: "5k-10k", label: "5 000 € - 10 000 €" },
                      { value: "10k-20k", label: "10 000 € - 20 000 €" },
                      { value: "plus-20k", label: "Plus de 20 000 €" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>
                  <Button type="submit" className="btn-gradient text-white">
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Détails du projet */}
          {step === 3 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h2 className="mb-6 text-2xl font-bold">Détails du projet</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Délai souhaité</Label>
                  <RadioGroup
                    value={formData.delai}
                    onValueChange={handleDelaiChange}
                    className="grid gap-4 md:grid-cols-2"
                    name="delai"
                  >
                    {[
                      { value: "urgent", label: "Urgent (< 1 mois)" },
                      { value: "1-3-mois", label: "1 à 3 mois" },
                      { value: "3-6-mois", label: "3 à 6 mois" },
                      { value: "plus-6-mois", label: "Plus de 6 mois" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du projet *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet, vos objectifs et vos attentes..."
                    className="min-h-[150px] border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>
                  <Button type="submit" className="btn-gradient text-white">
                    Vérifier et confirmer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="rounded-lg border bg-card p-8 shadow-sm"
            >
              <h2 className="mb-6 text-2xl font-bold text-center">Confirmation de votre demande</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Informations personnelles</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Nom</p>
                      <p className="font-medium">{formData.nom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    {formData.telephone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{formData.telephone}</p>
                      </div>
                    )}
                    {formData.entreprise && (
                      <div>
                        <p className="text-sm text-muted-foreground">Entreprise</p>
                        <p className="font-medium">{formData.entreprise}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Détails du projet</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Services requis</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.services.map((service) => (
                          <Badge key={service} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget estimé</p>
                      <p className="font-medium">
                        {formData.budget === "moins-5k"
                          ? "Moins de 5 000 €"
                          : formData.budget === "5k-10k"
                            ? "5 000 € - 10 000 €"
                            : formData.budget === "10k-20k"
                              ? "10 000 € - 20 000 €"
                              : "Plus de 20 000 €"}
                      </p>
                    </div>
                    {formData.delai && (
                      <div>
                        <p className="text-sm text-muted-foreground">Délai souhaité</p>
                        <p className="font-medium">
                          {formData.delai === "urgent"
                            ? "Urgent (< 1 mois)"
                            : formData.delai === "1-3-mois"
                              ? "1 à 3 mois"
                              : formData.delai === "3-6-mois"
                                ? "3 à 6 mois"
                                : "Plus de 6 mois"}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Description du projet</p>
                      <p className="mt-1 text-sm">{formData.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    className="btn-gradient text-white"
                    onClick={submitFinalForm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer la demande
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Succès */}
          {step === 5 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="rounded-lg border bg-card p-8 shadow-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
              >
                <Check className="h-10 w-10 text-green-600" />
              </motion.div>
              <h2 className="mb-4 text-2xl font-bold">Demande envoyée avec succès !</h2>
              <p className="mb-6 text-muted-foreground">
                Merci pour votre demande de devis. Notre équipe l'examinera et vous contactera dans les 24 à 48 heures
                ouvrables.
              </p>
              {devMode && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-700 text-sm font-medium mb-2">
                    {warning || "Mode développement: Les données ne sont pas enregistrées en base de données."}
                  </p>
                  <p className="text-amber-700 text-xs">
                    Votre demande a été sauvegardée localement dans votre navigateur. En environnement de production,
                    elle serait enregistrée dans la base de données Supabase.
                  </p>
                  <div className="mt-3 text-left">
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium">Voir les détails de la demande</summary>
                      <div className="mt-2 p-2 bg-white/50 rounded text-left overflow-auto max-h-40">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(
                            {
                              nom: formData.nom,
                              email: formData.email,
                              telephone: formData.telephone || null,
                              entreprise: formData.entreprise || null,
                              services: formData.services,
                              budget: formData.budget,
                              delai: formData.delai || null,
                              description: formData.description,
                              date: new Date().toISOString(),
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    </details>
                  </div>
                </div>
              )}
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Retour à l'accueil
                  </Button>
                </Link>
                <Link href="/projets">
                  <Button className="btn-gradient text-white w-full sm:w-auto">Voir nos projets</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-gradient">AIDA</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AIDA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
