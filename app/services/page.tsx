"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PenTool, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react"
import AnimatedText from "@/components/animated-text"
import AnimatedCard from "@/components/animated-card"
import ParallaxSection from "@/components/parallax-section"

// Données des services
const services = [
  {
    id: "design-graphique",
    titre: "Design Graphique",
    description:
      "Nous créons des identités visuelles percutantes et cohérentes qui reflètent l'essence de votre marque et captent l'attention de votre audience.",
    image: "/placeholder.svg?height=600&width=800",
    icone: (
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
        className="h-8 w-8 text-blue-600"
      >
        <circle cx="13.5" cy="6.5" r="2.5" />
        <path d="M17 18.5a4 4 0 0 0-3.5-3.9" />
        <path d="M19 13.5a9 9 0 0 0-8.5-8.9" />
        <path d="M5 18.5a4 4 0 0 1 3.5-3.9" />
        <path d="M3 13.5a9 9 0 0 1 8.5-8.9" />
        <path d="M7 15a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v0z" />
      </svg>
    ),
    prestations: [
      "Création de logo et identité visuelle",
      "Charte graphique complète",
      "Supports de communication print",
      "Packaging et design produit",
      "Signalétique et PLV",
    ],
  },
  {
    id: "web-digital",
    titre: "Web & Digital",
    description:
      "Nous concevons et développons des sites web et applications qui allient esthétique, fonctionnalité et performance pour une expérience utilisateur optimale.",
    image: "/placeholder.svg?height=600&width=800",
    icone: (
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
        className="h-8 w-8 text-blue-600"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
    prestations: [
      "Création de sites web responsive",
      "Développement d'applications web et mobiles",
      "E-commerce et boutiques en ligne",
      "Maintenance et hébergement",
      "Audit et optimisation de sites existants",
    ],
  },
  {
    id: "strategie-marque",
    titre: "Stratégie de Marque",
    description:
      "Nous élaborons des stratégies de marque complètes qui définissent votre positionnement, votre message et votre voix pour une communication cohérente et impactante.",
    image: "/placeholder.svg?height=600&width=800",
    icone: (
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
        className="h-8 w-8 text-blue-600"
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </svg>
    ),
    prestations: [
      "Audit et positionnement de marque",
      "Plateforme de marque",
      "Storytelling et messages clés",
      "Stratégie de communication",
      "Accompagnement au changement",
    ],
  },
  {
    id: "marketing-digital",
    titre: "Marketing Digital",
    description:
      "Nous mettons en place des stratégies digitales performantes pour augmenter votre visibilité en ligne, générer du trafic qualifié et convertir vos visiteurs en clients.",
    image: "/placeholder.svg?height=600&width=800",
    icone: (
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
        className="h-8 w-8 text-blue-600"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    prestations: [
      "Stratégie de contenu et SEO",
      "Campagnes Google Ads et SEA",
      "Social Media Marketing",
      "Email marketing",
      "Analyse de données et reporting",
    ],
  },
  {
    id: "relations-presse",
    titre: "Relations Presse",
    description:
      "Nous développons et entretenons des relations solides avec les médias pour assurer une couverture médiatique optimale de votre entreprise et de vos actualités.",
    image: "/placeholder.svg?height=600&width=800",
    icone: (
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
        className="h-8 w-8 text-blue-600"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    prestations: [
      "Communiqués et dossiers de presse",
      "Organisation de conférences de presse",
      "Relations médias",
      "Veille médiatique",
      "Formation média training",
    ],
  },
  {
    id: "evenementiel",
    titre: "Événementiel",
    description:
      "Nous concevons et organisons des événements sur mesure qui marquent les esprits et renforcent votre image de marque auprès de vos publics cibles.",
    image: "/placeholder.svg?height=600&width=800",
    icone: (
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
        className="h-8 w-8 text-blue-600"
      >
        <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.8a2 2 0 0 1 1.4-.6h3.8a2 2 0 0 1 2 2v2.2Z" />
        <path d="M12 12v6" />
        <path d="M16 16H8" />
      </svg>
    ),
    prestations: [
      "Conception et organisation d'événements",
      "Lancements de produits",
      "Séminaires et conférences",
      "Salons professionnels",
      "Événements internes et team building",
    ],
  },
]

export default function ServicesPage() {
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
                Nos <span className="text-gradient">services</span>
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Découvrez notre gamme complète de services de communication pour transformer votre marque et captiver
                votre audience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <AnimatedText
                text="Des solutions complètes pour votre communication"
                className="text-2xl font-bold tracking-tighter md:text-3xl/tight"
                delay={1}
              />
              <p className="mt-4 text-muted-foreground md:text-lg">
                Chez AIDA, nous proposons une approche intégrée de la communication. Nos services sont conçus pour
                travailler en synergie, créant une stratégie cohérente qui renforce votre marque à chaque point de
                contact avec votre audience.
              </p>
            </motion.div>

            <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <AnimatedCard
                  key={service.id}
                  className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all"
                  delay={index}
                >
                  <div className="p-6">
                    <div className="rounded-full bg-blue-100 p-4 w-16 h-16 flex items-center justify-center mb-4">
                      {service.icone}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.titre}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <Link href={`#${service.id}`}>
                      <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                        En savoir plus
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Services détaillés */}
        {services.map((service, index) => (
          <ParallaxSection
            key={service.id}
            id={service.id}
            className={`w-full py-12 md:py-24 ${index % 2 === 0 ? "bg-muted" : "bg-background"}`}
            baseVelocity={0.2}
          >
            <div className="container px-4 md:px-6">
              <div
                className={`grid gap-6 lg:grid-cols-2 lg:gap-12 items-center ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <AnimatedText
                    text={service.titre}
                    className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                    delay={1}
                  />
                  <p className="text-muted-foreground md:text-lg">{service.description}</p>
                  <div className="space-y-3 mt-6">
                    <h4 className="text-lg font-medium">Nos prestations :</h4>
                    <ul className="space-y-2">
                      {service.prestations.map((prestation, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                          <span>{prestation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4">
                    <Link href="/devis">
                      <Button className="btn-gradient text-white">
                        Demander un devis
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <motion.div
                    className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 opacity-75 blur"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                  <Image
                    src={service.image || "/placeholder.svg"}
                    width={800}
                    height={600}
                    alt={service.titre}
                    className="rounded-lg object-cover relative z-10"
                  />
                </motion.div>
              </div>
            </div>
          </ParallaxSection>
        ))}

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-blue-gradient">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <AnimatedText
                text="Prêt à transformer votre communication ?"
                className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                delay={3}
              />
              <p className="mt-4 text-muted-foreground md:text-lg">
                Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous
                aider à atteindre vos objectifs.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
              >
                <Link href="/devis">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                    Demander un devis
                  </Button>
                </Link>
                <Link href="/projets">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Voir nos réalisations
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
