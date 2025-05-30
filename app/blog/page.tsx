"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PenTool, ArrowLeft, Search, Calendar, Clock, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import AnimatedCard from "@/components/animated-card"
import { inscrireNewsletter } from "@/app/actions/newsletter"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Données des articles de blog
const articles = [
  {
    id: 1,
    titre: "Comment créer une identité visuelle cohérente pour votre marque",
    extrait:
      "Découvrez les étapes essentielles pour développer une identité visuelle forte et cohérente qui reflète les valeurs de votre marque et capte l'attention de votre audience.",
    image: "/placeholder.svg?height=600&width=800",
    categorie: "Design",
    auteur: "Sophie Martin",
    date: "15 avril 2023",
    tempsLecture: "5 min",
    tags: ["Identité visuelle", "Branding", "Design graphique"],
  },
  {
    id: 2,
    titre: "Les tendances du marketing digital en 2023",
    extrait:
      "Explorez les dernières tendances du marketing digital qui façonnent le paysage numérique cette année et comment les intégrer dans votre stratégie pour rester compétitif.",
    image: "/placeholder.svg?height=600&width=800",
    categorie: "Marketing",
    auteur: "Thomas Dubois",
    date: "28 mars 2023",
    tempsLecture: "7 min",
    tags: ["Marketing digital", "Tendances", "Stratégie"],
  },
  {
    id: 3,
    titre: "L'importance du storytelling dans votre communication",
    extrait:
      "Le storytelling est devenu un élément incontournable de la communication des marques. Découvrez pourquoi et comment l'utiliser efficacement pour créer une connexion émotionnelle avec votre audience.",
    image: "/placeholder.svg?height=600&width=800",
    categorie: "Communication",
    auteur: "Julie Leroy",
    date: "10 février 2023",
    tempsLecture: "6 min",
    tags: ["Storytelling", "Communication", "Contenu"],
  },
  {
    id: 4,
    titre: "Comment optimiser votre site web pour le SEO en 2023",
    extrait:
      "Les algorithmes des moteurs de recherche évoluent constamment. Découvrez les meilleures pratiques actuelles pour optimiser votre site web et améliorer votre visibilité en ligne.",
    image: "/placeholder.svg?height=600&width=800",
    categorie: "Web",
    auteur: "Alexandre Moreau",
    date: "5 janvier 2023",
    tempsLecture: "8 min",
    tags: ["SEO", "Site web", "Référencement"],
  },
  {
    id: 5,
    titre: "Les clés d'une campagne de relations presse réussie",
    extrait:
      "Apprenez à planifier et exécuter une campagne de relations presse efficace qui génère une couverture médiatique positive et renforce la crédibilité de votre marque.",
    image: "/placeholder.svg?height=600&width=800",
    categorie: "Relations Presse",
    auteur: "Camille Petit",
    date: "20 décembre 2022",
    tempsLecture: "5 min",
    tags: ["Relations presse", "Médias", "Communication"],
  },
  {
    id: 6,
    titre: "Comment organiser un événement d'entreprise mémorable",
    extrait:
      "De la planification à l'exécution, découvrez les étapes clés pour organiser un événement d'entreprise qui marque les esprits et renforce votre image de marque.",
    image: "/placeholder.svg?height=600&width=800",
    categorie: "Événementiel",
    auteur: "Marc Dupont",
    date: "8 novembre 2022",
    tempsLecture: "6 min",
    tags: ["Événementiel", "Organisation", "Entreprise"],
  },
]

// Toutes les catégories uniques
const categories = Array.from(new Set(articles.map((article) => article.categorie)))

export default function BlogPage() {
  const [filtreCategorie, setFiltreCategorie] = useState<string | null>(null)
  const [recherche, setRecherche] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({ type: null, message: null })

  // Filtrer les articles en fonction de la catégorie et de la recherche
  const articlesFiltres = articles.filter((article) => {
    const matchCategorie = filtreCategorie ? article.categorie === filtreCategorie : true
    const matchRecherche = recherche
      ? article.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        article.extrait.toLowerCase().includes(recherche.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(recherche.toLowerCase()))
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

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const result = await inscrireNewsletter(formData)

      if (result.success) {
        setNewsletterStatus({
          type: "success",
          message: result.message,
        })
        // Réinitialiser le formulaire
        form.reset()
      } else {
        setNewsletterStatus({
          type: "error",
          message: result.message,
        })
      }
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message: "Une erreur inattendue est survenue. Veuillez réessayer.",
      })
    }
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
                Notre <span className="text-gradient">blog</span>
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Découvrez nos articles, conseils et analyses sur les dernières tendances en communication et marketing.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filtres et Recherche */}
        <section className="w-full py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
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
                  placeholder="Rechercher un article..."
                  className="pl-8 border-blue-200 focus:border-blue-500"
                  value={recherche}
                  onChange={handleRechercheChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            {articlesFiltres.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <h3 className="text-xl font-medium mb-2">Aucun article ne correspond à vos critères</h3>
                <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres ou votre recherche</p>
                <Button onClick={resetFiltres}>Réinitialiser les filtres</Button>
              </motion.div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articlesFiltres.map((article, index) => (
                  <AnimatedCard
                    key={article.id}
                    className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all"
                    delay={index}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.titre}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">{article.categorie}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{article.tempsLecture}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.titre}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{article.extrait}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{article.auteur}</span>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          Lire l'article
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl font-bold tracking-tighter md:text-3xl/tight">
                Restez informé des dernières tendances
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et conseils directement dans votre
                boîte mail.
              </p>

              {/* Message de statut */}
              {newsletterStatus.type && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="my-4">
                  <Alert variant={newsletterStatus.type === "success" ? "default" : "destructive"}>
                    {newsletterStatus.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{newsletterStatus.message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  name="email"
                  placeholder="Votre adresse email"
                  className="border-blue-200 focus:border-blue-500"
                  required
                />
                <Button type="submit" className="btn-gradient text-white">
                  S'inscrire
                </Button>
              </form>
            </motion.div>
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
