"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PenTool, ArrowLeft, Linkedin, Twitter, Mail } from "lucide-react"
import AnimatedText from "@/components/animated-text"
import AnimatedCard from "@/components/animated-card"

// Données de l'équipe
const equipe = [
  {
    id: 1,
    nom: "Sophie Martin",
    poste: "Directrice Créative",
    bio: "Avec plus de 10 ans d'expérience dans la direction artistique, Sophie apporte une vision créative unique à chaque projet. Diplômée des Arts Décoratifs de Paris, elle a travaillé pour plusieurs agences renommées avant de cofonder AIDA.",
    image: "/placeholder.svg?height=400&width=400",
    linkedin: "#",
    twitter: "#",
    email: "sophie@aida.fr",
  },
  {
    id: 2,
    nom: "Thomas Dubois",
    poste: "Directeur Stratégie",
    bio: "Expert en stratégie de marque et communication, Thomas a accompagné de nombreuses entreprises dans leur développement. Son approche analytique et sa vision business apportent une dimension stratégique essentielle à nos projets.",
    image: "/placeholder.svg?height=400&width=400",
    linkedin: "#",
    twitter: "#",
    email: "thomas@aida.fr",
  },
  {
    id: 3,
    nom: "Julie Leroy",
    poste: "Responsable Digital",
    bio: "Spécialiste du marketing digital et des réseaux sociaux, Julie maîtrise parfaitement les enjeux de la communication en ligne. Sa créativité et sa connaissance des tendances digitales sont des atouts majeurs pour nos clients.",
    image: "/placeholder.svg?height=400&width=400",
    linkedin: "#",
    twitter: "#",
    email: "julie@aida.fr",
  },
  {
    id: 4,
    nom: "Marc Dupont",
    poste: "Designer UX/UI",
    bio: "Marc conçoit des expériences utilisateur intuitives et des interfaces élégantes. Sa double compétence en design et en développement front-end lui permet de créer des sites web et applications qui allient esthétique et fonctionnalité.",
    image: "/placeholder.svg?height=400&width=400",
    linkedin: "#",
    twitter: "#",
    email: "marc@aida.fr",
  },
  {
    id: 5,
    nom: "Camille Petit",
    poste: "Chargée de Relations Presse",
    bio: "Avec son excellent réseau dans les médias et sa plume affûtée, Camille assure une visibilité optimale à nos clients. Elle excelle dans la rédaction de communiqués percutants et l'organisation d'événements presse.",
    image: "/placeholder.svg?height=400&width=400",
    linkedin: "#",
    twitter: "#",
    email: "camille@aida.fr",
  },
  {
    id: 6,
    nom: "Alexandre Moreau",
    poste: "Développeur Web",
    bio: "Alexandre transforme les designs en sites web performants et responsives. Passionné par les nouvelles technologies, il reste constamment à l'affût des dernières innovations pour offrir des solutions techniques optimales.",
    image: "/placeholder.svg?height=400&width=400",
    linkedin: "#",
    twitter: "#",
    email: "alexandre@aida.fr",
  },
]

export default function EquipePage() {
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
                Notre <span className="text-gradient">équipe</span>
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Découvrez les talents passionnés qui composent AIDA et qui mettent leur expertise au service de votre
                communication.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Notre philosophie */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <AnimatedText
                  text="Une équipe passionnée et experte"
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                  delay={1}
                />
                <p className="text-muted-foreground md:text-lg">
                  Chez AIDA, nous croyons que la diversité des talents et des perspectives est la clé d'une
                  communication réussie. Notre équipe réunit des experts dans différents domaines de la communication,
                  tous animés par la même passion : créer des stratégies innovantes et impactantes pour nos clients.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  Chaque membre apporte sa pierre à l'édifice, combinant créativité et rigueur pour transformer vos
                  idées en réalisations concrètes. Nous travaillons en étroite collaboration, partageant nos
                  connaissances et notre enthousiasme pour vous offrir un service sur mesure et de qualité.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
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
                  src="/placeholder.svg?height=600&width=800"
                  width={800}
                  height={600}
                  alt="L'équipe AIDA en réunion"
                  className="rounded-lg object-cover relative z-10"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Membres de l'équipe */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <AnimatedText
                text="Rencontrez nos talents"
                className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                delay={2}
              />
              <p className="mt-4 text-muted-foreground md:text-lg max-w-3xl mx-auto">
                Chaque membre de notre équipe apporte son expertise unique et sa passion pour créer des stratégies de
                communication qui font la différence.
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {equipe.map((membre, index) => (
                <AnimatedCard
                  key={membre.id}
                  className="bg-card rounded-lg overflow-hidden border shadow-sm"
                  delay={index}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={membre.image || "/placeholder.svg"}
                      alt={membre.nom}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-xl font-bold text-white">{membre.nom}</h3>
                        <p className="text-white/80">{membre.poste}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4">{membre.bio}</p>
                    <div className="flex space-x-3">
                      <motion.a
                        href={membre.linkedin}
                        whileHover={{ y: -3 }}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </motion.a>
                      <motion.a
                        href={membre.twitter}
                        whileHover={{ y: -3 }}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </motion.a>
                      <motion.a
                        href={`mailto:${membre.email}`}
                        whileHover={{ y: -3 }}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="sr-only">Email</span>
                      </motion.a>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Rejoignez-nous */}
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
                text="Rejoignez notre équipe"
                className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                delay={3}
              />
              <p className="mt-4 text-muted-foreground md:text-lg">
                Vous êtes passionné par la communication et souhaitez rejoindre une équipe dynamique ? Découvrez nos
                opportunités de carrière.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Voir nos offres d'emploi
                </Button>
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
