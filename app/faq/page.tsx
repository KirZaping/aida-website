"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PenTool, ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import AnimatedText from "@/components/animated-text"

// Données des FAQ
const faqs = [
  {
    id: 1,
    categorie: "Services",
    questions: [
      {
        question: "Quels services proposez-vous ?",
        reponse:
          "AIDA propose une gamme complète de services de communication incluant le design graphique, le développement web et digital, la stratégie de marque, le marketing digital, les relations presse et l'événementiel. Nous adaptons nos services aux besoins spécifiques de chaque client pour créer des solutions sur mesure.",
      },
      {
        question: "Comment se déroule un projet avec AIDA ?",
        reponse:
          "Chaque projet débute par une phase de découverte où nous analysons vos besoins, objectifs et contraintes. Nous élaborons ensuite une proposition détaillée incluant stratégie, planning et budget. Après validation, nous entrons dans la phase de création et de production, avec des points d'étape réguliers. Le projet se conclut par une phase d'évaluation des résultats.",
      },
      {
        question: "Travaillez-vous avec des entreprises de toutes tailles ?",
        reponse:
          "Oui, nous travaillons avec des entreprises de toutes tailles, des startups aux grands groupes. Nous adaptons notre approche et nos solutions en fonction de la taille, des besoins et du budget de chaque client.",
      },
    ],
  },
  {
    id: 2,
    categorie: "Tarifs",
    questions: [
      {
        question: "Comment sont calculés vos tarifs ?",
        reponse:
          "Nos tarifs sont établis en fonction de la complexité du projet, du temps nécessaire à sa réalisation et des ressources mobilisées. Nous proposons des devis personnalisés après une analyse approfondie de vos besoins. Nous pouvons travailler au forfait pour des projets bien définis ou en régie pour un accompagnement plus flexible.",
      },
      {
        question: "Proposez-vous des forfaits ou des abonnements ?",
        reponse:
          "Oui, nous proposons des forfaits pour des projets spécifiques ainsi que des formules d'abonnement pour un accompagnement régulier. Ces formules sont particulièrement adaptées pour la gestion des réseaux sociaux, la création de contenu récurrent ou la maintenance de sites web.",
      },
      {
        question: "Quel est le budget minimum pour travailler avec AIDA ?",
        reponse:
          "Le budget varie en fonction de vos besoins et de l'ampleur du projet. Nous nous efforçons de proposer des solutions adaptées à différents budgets tout en maintenant un niveau de qualité élevé. N'hésitez pas à nous contacter pour discuter de votre projet et de votre budget.",
      },
    ],
  },
  {
    id: 3,
    categorie: "Processus",
    questions: [
      {
        question: "Combien de temps faut-il pour réaliser un projet ?",
        reponse:
          "La durée d'un projet dépend de sa nature et de sa complexité. Une création de logo peut prendre 2 à 4 semaines, tandis qu'une refonte complète d'identité visuelle ou un site web complexe peut nécessiter 2 à 4 mois. Lors de notre première consultation, nous établirons un calendrier détaillé adapté à votre projet.",
      },
      {
        question: "Comment se déroulent les échanges pendant le projet ?",
        reponse:
          "Nous privilégions une communication transparente et régulière. Chaque client dispose d'un interlocuteur dédié qui coordonne le projet. Nous organisons des points d'étape réguliers et utilisons des outils collaboratifs pour partager les avancées et recueillir vos retours.",
      },
      {
        question: "Que se passe-t-il si je ne suis pas satisfait du résultat ?",
        reponse:
          "Votre satisfaction est notre priorité. Notre processus inclut plusieurs phases de validation pour nous assurer que le projet répond à vos attentes. Si malgré cela vous n'êtes pas satisfait, nous effectuons les ajustements nécessaires dans le cadre des révisions prévues dans notre contrat.",
      },
    ],
  },
  {
    id: 4,
    categorie: "Technique",
    questions: [
      {
        question: "Quelles technologies utilisez-vous pour les sites web ?",
        reponse:
          "Nous utilisons les technologies les plus récentes et adaptées à chaque projet. Pour les sites vitrines et blogs, nous privilégions WordPress pour sa flexibilité et sa facilité de gestion. Pour les sites e-commerce, nous utilisons WooCommerce ou Shopify. Pour les applications web complexes, nous développons avec React, Next.js ou d'autres frameworks modernes.",
      },
      {
        question: "Proposez-vous l'hébergement et la maintenance des sites web ?",
        reponse:
          "Oui, nous proposons des solutions d'hébergement sécurisées et performantes ainsi que des contrats de maintenance pour assurer le bon fonctionnement de votre site web. Nos forfaits de maintenance incluent les mises à jour de sécurité, les sauvegardes régulières et un support technique.",
      },
      {
        question: "Comment assurez-vous la sécurité des sites web que vous créez ?",
        reponse:
          "La sécurité est une priorité dans tous nos développements web. Nous mettons en place des protocoles de sécurité robustes, utilisons des certificats SSL, effectuons des mises à jour régulières et suivons les meilleures pratiques du secteur pour protéger votre site et les données de vos utilisateurs.",
      },
    ],
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleCategory = (categoryId: number) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId)
    setActiveQuestion(null)
  }

  const toggleQuestion = (questionIndex: number) => {
    setActiveQuestion(activeQuestion === questionIndex ? null : questionIndex)
  }

  // Filtrer les FAQs en fonction de la recherche
  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.reponse.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

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
                Questions <span className="text-gradient">fréquentes</span>
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Trouvez rapidement des réponses à vos questions sur nos services et notre façon de travailler.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Recherche */}
        <section className="w-full py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher une question..."
                  className="pl-10 border-blue-200 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              {filteredFaqs.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Aucun résultat trouvé</h3>
                  <p className="text-muted-foreground mb-6">
                    Essayez de modifier votre recherche ou contactez-nous directement.
                  </p>
                  <Button onClick={() => setSearchQuery("")}>Réinitialiser la recherche</Button>
                </motion.div>
              ) : (
                filteredFaqs.map((categorie) => (
                  <motion.div
                    key={categorie.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <button
                      onClick={() => toggleCategory(categorie.id)}
                      className="flex items-center justify-between w-full py-4 px-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <h2 className="text-xl font-bold">{categorie.categorie}</h2>
                      {activeCategory === categorie.id ? (
                        <ChevronUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-blue-600" />
                      )}
                    </button>

                    {activeCategory === categorie.id && (
                      <div className="mt-4 space-y-4">
                        {categorie.questions.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="border rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleQuestion(index)}
                              className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/50 transition-colors"
                            >
                              <h3 className="font-medium">{item.question}</h3>
                              {activeQuestion === index ? (
                                <ChevronUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              )}
                            </button>
                            {activeQuestion === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.3 }}
                                className="p-4 bg-muted/30 border-t"
                              >
                                <p className="text-muted-foreground">{item.reponse}</p>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <AnimatedText
                text="Vous n'avez pas trouvé votre réponse ?"
                className="text-2xl font-bold tracking-tighter md:text-3xl/tight"
                delay={1}
              />
              <p className="mt-4 text-muted-foreground md:text-lg">
                Notre équipe est à votre disposition pour répondre à toutes vos questions.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
              >
                <Link href="/#contact">
                  <Button size="lg" className="btn-gradient text-white w-full sm:w-auto">
                    Nous contacter
                  </Button>
                </Link>
                <Link href="/devis">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                  >
                    Demander un devis
                  </Button>
                </Link>
              </motion.div>
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
