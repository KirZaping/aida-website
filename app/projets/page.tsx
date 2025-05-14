"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PenTool, ArrowLeft, Search, Filter, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import AnimatedText from "@/components/animated-text"

// Données des projets (à remplacer par des données réelles)
const projets = [
  {
    id: 1,
    titre: "Refonte de marque TechCorp",
    categorie: "Identité visuelle",
    tags: ["Logo", "Charte graphique", "Site web"],
    description:
      "Refonte complète de l'identité visuelle de TechCorp, incluant un nouveau logo, une charte graphique et un site web responsive.",
    image: "/placeholder.svg?height=600&width=800",
    client: "TechCorp",
    annee: "2023",
  },
  {
    id: 2,
    titre: "Campagne digitale EcoVert",
    categorie: "Marketing digital",
    tags: ["Réseaux sociaux", "SEA", "Contenu"],
    description:
      "Campagne de marketing digital pour le lancement d'une nouvelle gamme de produits écologiques, incluant une stratégie de contenu et des publicités ciblées.",
    image: "/placeholder.svg?height=600&width=800",
    client: "EcoVert",
    annee: "2023",
  },
  {
    id: 3,
    titre: "Lancement produit InnoSanté",
    categorie: "Événementiel",
    tags: ["Événement", "Relations presse", "Vidéo"],
    description:
      "Organisation d'un événement de lancement pour un nouveau dispositif médical, incluant les relations presse et la production de contenu vidéo.",
    image: "/placeholder.svg?height=600&width=800",
    client: "InnoSanté",
    annee: "2023",
  },
  {
    id: 4,
    titre: "Stratégie de communication GlobalTech",
    categorie: "Stratégie",
    tags: ["Stratégie", "Positionnement", "Messaging"],
    description:
      "Élaboration d'une stratégie de communication globale pour renforcer le positionnement de l'entreprise sur son marché.",
    image: "/placeholder.svg?height=600&width=800",
    client: "GlobalTech",
    annee: "2023",
  },
  {
    id: 5,
    titre: "Campagne publicitaire FoodExpress",
    categorie: "Publicité",
    tags: ["Affichage", "Digital", "Radio"],
    description:
      "Conception et déploiement d'une campagne publicitaire multicanal pour une chaîne de restauration rapide.",
    image: "/placeholder.svg?height=600&width=800",
    client: "FoodExpress",
    annee: "2023",
  },
  {
    id: 6,
    titre: "Refonte site e-commerce ModaStyle",
    categorie: "Web & Digital",
    tags: ["E-commerce", "UX/UI", "SEO"],
    description:
      "Refonte complète d'un site e-commerce de mode, avec optimisation de l'expérience utilisateur et du référencement naturel.",
    image: "/placeholder.svg?height=600&width=800",
    client: "ModaStyle",
    annee: "2023",
  },
]

// Toutes les catégories uniques
const categories = Array.from(new Set(projets.map((projet) => projet.categorie)))

export default function ProjetsPage() {
  const [filtreCategorie, setFiltreCategorie] = useState<string | null>(null)
  const [recherche, setRecherche] = useState("")
  const [projetActif, setProjetActif] = useState<number | null>(null)

  // Filtrer les projets en fonction de la catégorie et de la recherche
  const projetsFiltres = projets.filter((projet) => {
    const matchCategorie = filtreCategorie ? projet.categorie === filtreCategorie : true
    const matchRecherche = recherche
      ? projet.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        projet.description.toLowerCase().includes(recherche.toLowerCase()) ||
        projet.client.toLowerCase().includes(recherche.toLowerCase()) ||
        projet.tags.some((tag) => tag.toLowerCase().includes(recherche.toLowerCase()))
      : true
    return matchCategorie && matchRecherche
  })

  const handleCategorieClick = (categorie: string) => {
    setFiltreCategorie(categorie === filtreCategorie ? null : categorie)
  }

  const handleRechercheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecherche(e.target.value)
  }

  const resetFiltres = () => {
    setFiltreCategorie(null)
    setRecherche("")
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-blue-gradient">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Nos <span className="text-gradient">réalisations</span>
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Découvrez nos projets récents et comment nous avons aidé nos clients à atteindre leurs objectifs de
                communication.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filtres et Recherche */}
        <section className="w-full py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Button
                  variant={filtreCategorie === null ? "default" : "outline"}
                  size="sm"
                  onClick={resetFiltres}
                  className="flex-shrink-0"
                >
                  Tous
                </Button>
                {categories.map((categorie) => (
                  <Button
                    key={categorie}
                    variant={filtreCategorie === categorie ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategorieClick(categorie)}
                    className="flex-shrink-0"
                  >
                    {categorie}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un projet..."
                  className="pl-8 border-blue-200 focus:border-blue-500"
                  value={recherche}
                  onChange={handleRechercheChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Liste des projets */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            {projetsFiltres.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <h3 className="text-xl font-medium mb-2">Aucun projet ne correspond à vos critères</h3>
                <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres ou votre recherche</p>
                <Button onClick={resetFiltres}>Réinitialiser les filtres</Button>
              </motion.div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {projetsFiltres.map((projet, index) => (
                    <motion.div
                      key={projet.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={projet.image || "/placeholder.svg"}
                          alt={projet.titre}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white border-white hover:bg-white/20 hover:text-white"
                            onClick={() => setProjetActif(projet.id)}
                          >
                            Voir le projet
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {projet.categorie}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{projet.annee}</span>
                        </div>
                        <h3 className="font-bold">{projet.titre}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{projet.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {projet.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* Modal de détail du projet */}
        <AnimatePresence>
          {projetActif && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-50"
                onClick={() => setProjetActif(null)}
              />
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-x-0 bottom-0 top-20 z-50 mx-auto max-w-4xl overflow-auto rounded-t-xl bg-background p-6 shadow-xl"
              >
                {(() => {
                  const projet = projets.find((p) => p.id === projetActif)
                  if (!projet) return null
                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">{projet.titre}</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setProjetActif(null)}
                          className="rounded-full"
                        >
                          <span className="sr-only">Fermer</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="relative rounded-lg overflow-hidden">
                          <Image
                            src={projet.image || "/placeholder.svg"}
                            alt={projet.titre}
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        <div>
                          <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">À propos du projet</h3>
                            <p className="text-muted-foreground">{projet.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Client</h4>
                              <p>{projet.client}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Année</h4>
                              <p>{projet.annee}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Catégorie</h4>
                              <p>{projet.categorie}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {projet.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Résultats</h3>
                            <ul className="space-y-2 text-muted-foreground">
                              <li className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Augmentation de la visibilité de la marque
                              </li>
                              <li className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Amélioration de l'engagement client
                              </li>
                              <li className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Croissance des ventes et du chiffre d'affaires
                              </li>
                            </ul>
                          </div>
                          <div className="mt-6">
                            <Button className="btn-gradient text-white w-full">
                              Voir l'étude de cas complète
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <AnimatedText
                text="Prêt à lancer votre projet ?"
                className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                delay={1}
              />
              <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous
                aider à atteindre vos objectifs.
              </p>
              <div className="mt-8 flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/devis">
                  <Button size="lg" className="btn-gradient text-white border-0 px-8">
                    Demander un devis
                  </Button>
                </Link>
                <Link href="/#contact">
                  <Button size="lg" variant="outline" className="px-8 border-blue-500 text-blue-600 hover:bg-blue-50">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
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
