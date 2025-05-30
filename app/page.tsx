"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Award,
  BarChart,
  BrainCircuit,
  ChevronRight,
  Globe,
  Instagram,
  Linkedin,
  MessageSquare,
  Palette,
  PenTool,
  Phone,
  Send,
  Twitter,
  MousePointer,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import AnimatedText from "@/components/animated-text"
import AnimatedCard from "@/components/animated-card"
import ParallaxSection from "@/components/parallax-section"
import ScrollToTop from "@/components/scroll-to-top"
import { envoyerMessage } from "@/app/actions/contact"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Ajouter l'import du composant SupabaseStatus en haut du fichier
import SupabaseStatus from "@/components/supabase-status"

// Dans le composant Home, ajouter le composant SupabaseStatus juste après l'ouverture de la balise <main>
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [contactStatus, setContactStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({ type: null, message: null })

  const contactFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: 0.5,
    },
    button: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 64,
      width: 64,
      opacity: 0.1,
      backgroundColor: "#3b82f6",
    },
  }

  const enterButton = () => setCursorVariant("button")
  const leaveButton = () => setCursorVariant("default")

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const result = await envoyerMessage(formData)

      if (result.success) {
        setContactStatus({
          type: "success",
          message: result.message,
        })
        // Réinitialiser le formulaire
        form.reset()
      } else {
        setContactStatus({
          type: "error",
          message: result.message,
        })
      }

      // Faire défiler jusqu'au message de statut
      setTimeout(() => {
        const contactSection = document.getElementById("contact")
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      setContactStatus({
        type: "error",
        message: "Une erreur inattendue est survenue. Veuillez réessayer.",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-blue-500 z-50 pointer-events-none hidden md:block"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
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
          </div>
          <nav className="hidden md:flex gap-6">
            {[
              { name: "Accueil", href: "/" },
              { name: "Services", href: "/services" },
              { name: "Portfolio", href: "/projets" },
              { name: "Témoignages", href: "/#temoignages" },
              { name: "À propos", href: "/#apropos" },
              { name: "Blog", href: "/blog" },
              { name: "Contact", href: "/#contact" },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href} className="text-sm font-medium hover:text-blue-600 relative group">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2"
          >
            <Link href="/espace-client">
              <Button
                variant="outline"
                className="hidden md:inline-flex border-blue-500 text-blue-600 hover:bg-blue-50"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Espace client
              </Button>
            </Link>
            <Link href="/devis">
              <Button
                className="hidden md:inline-flex btn-gradient text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Demander un devis
              </Button>
            </Link>
          </motion.div>
          <Button variant="outline" size="icon" className="md:hidden">
            <span className="sr-only">Menu</span>
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
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </motion.header>

      <main className="flex-1">
        <SupabaseStatus />
        {/* Hero Section */}
        <section
          id="accueil"
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-gradient relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </motion.div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <AnimatedText
                    text="Transformez votre communication avec créativité et impact"
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    delay={1}
                  />
                  <motion.p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Nous créons des stratégies de communication innovantes qui font rayonner votre marque et captiver
                    votre audience.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link href="/services">
                    <Button
                      size="lg"
                      className="btn-gradient text-white border-0 px-8 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                      onMouseEnter={enterButton}
                      onMouseLeave={leaveButton}
                    >
                      <span className="relative z-10">Découvrir nos services</span>
                      <motion.div
                        className="absolute inset-0 rounded-md overflow-hidden"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90" />
                        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]" />
                      </motion.div>
                      <ChevronRight className="ml-2 h-4 w-4 relative z-10" />
                    </Button>
                  </Link>
                  <Link href="/projets">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all"
                      onMouseEnter={enterButton}
                      onMouseLeave={leaveButton}
                    >
                      Nos réalisations
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
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
                    src="/placeholder.svg?height=550&width=550"
                    width={550}
                    height={550}
                    alt="Illustration d'une stratégie de communication"
                    className="rounded-lg object-cover relative z-10"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <p className="text-sm font-medium mb-2">Découvrez nos services</p>
            <MousePointer className="h-5 w-5" />
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background relative">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Nos expertises
                </motion.div>
                <AnimatedText
                  text="Des solutions complètes pour votre communication"
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                  delay={2}
                />
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Nous accompagnons votre entreprise dans tous les aspects de sa communication pour construire une image
                  cohérente et impactante.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <Palette className="h-8 w-8 text-blue-600" />,
                  title: "Design Graphique",
                  description:
                    "Identité visuelle, logos, chartes graphiques et supports de communication qui reflètent l'essence de votre marque.",
                },
                {
                  icon: <Globe className="h-8 w-8 text-blue-600" />,
                  title: "Web & Digital",
                  description:
                    "Sites web, applications, réseaux sociaux et stratégies digitales pour une présence en ligne optimale.",
                },
                {
                  icon: <BrainCircuit className="h-8 w-8 text-blue-600" />,
                  title: "Stratégie de Marque",
                  description:
                    "Positionnement, storytelling et plans de communication pour renforcer votre image et votre message.",
                },
                {
                  icon: <BarChart className="h-8 w-8 text-blue-600" />,
                  title: "Marketing Digital",
                  description:
                    "Campagnes publicitaires, SEO/SEA et stratégies de contenu pour générer du trafic et des conversions.",
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
                  title: "Relations Presse",
                  description:
                    "Communiqués, dossiers de presse et relations médias pour augmenter votre visibilité et crédibilité.",
                },
                {
                  icon: <Award className="h-8 w-8 text-blue-600" />,
                  title: "Événementiel",
                  description:
                    "Organisation et communication d'événements professionnels qui marquent les esprits et renforcent votre image.",
                },
              ].map((service, index) => (
                <AnimatedCard
                  key={index}
                  className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm hover:border-blue-200 transition-colors"
                  delay={index}
                >
                  <motion.div
                    className="rounded-full bg-blue-100 p-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-center text-muted-foreground">{service.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <ParallaxSection className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Nos réalisations
                </motion.div>
                <AnimatedText
                  text="Découvrez nos projets récents"
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                  delay={3}
                />
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Des solutions créatives et stratégiques qui ont permis à nos clients d'atteindre leurs objectifs.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  image: "/placeholder.svg?height=400&width=600",
                  title: "Refonte de marque TechCorp",
                  description: "Identité visuelle et stratégie digitale",
                },
                {
                  image: "/placeholder.svg?height=400&width=600",
                  title: "Campagne EcoVert",
                  description: "Marketing digital et communication",
                },
                {
                  image: "/placeholder.svg?height=400&width=600",
                  title: "Lancement Produit InnoSanté",
                  description: "Événementiel et relations presse",
                },
              ].map((project, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Image
                    src={project.image || "/placeholder.svg"}
                    width={600}
                    height={400}
                    alt={project.title}
                    className="h-64 w-full object-cover transition-all group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    <p className="text-white/80">{project.description}</p>
                    <motion.button
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md w-max opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Voir le projet
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/projets">
                <Button
                  variant="outline"
                  size="lg"
                  className="group relative overflow-hidden border-blue-500 text-blue-600"
                  onMouseEnter={enterButton}
                  onMouseLeave={leaveButton}
                >
                  <span className="relative z-10">Voir tous nos projets</span>
                  <motion.span
                    className="absolute inset-0 bg-blue-100 w-0 transition-all duration-300 group-hover:w-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                  <ChevronRight className="ml-2 h-4 w-4 relative z-10" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </ParallaxSection>

        {/* Testimonials Section */}
        <section id="temoignages" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Témoignages
                </motion.div>
                <AnimatedText
                  text="Ce que nos clients disent de nous"
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                  delay={4}
                />
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  La satisfaction de nos clients est notre priorité et notre plus grande fierté.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              {[
                {
                  quote:
                    "L'équipe d'AIDA a complètement transformé notre image de marque. Leur approche stratégique et créative nous a permis de nous démarquer sur un marché très concurrentiel. Un vrai partenariat de confiance.",
                  name: "Sophie Martin",
                  title: "Directrice Marketing, TechCorp",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "La campagne digitale conçue par AIDA a dépassé toutes nos attentes. Nous avons vu une augmentation de 200% de notre trafic web et un taux de conversion en hausse de 45%. Des résultats concrets et mesurables.",
                  name: "Thomas Dubois",
                  title: "CEO, EcoVert",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "Travailler avec AIDA a été une expérience exceptionnelle. Leur créativité et leur réactivité ont permis de lancer notre produit dans des délais serrés avec un impact remarquable sur notre audience.",
                  name: "Marie Leroy",
                  title: "Responsable Communication, InnoSanté",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col justify-between rounded-lg border p-6 shadow-sm hover:border-blue-200 transition-colors"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                  }}
                >
                  <div className="space-y-4">
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-blue-600"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </motion.svg>
                      ))}
                    </motion.div>
                    <p className="text-muted-foreground">"{testimonial.quote}"</p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={`Photo de ${testimonial.name}`}
                        className="rounded-full border-2 border-blue-200"
                      />
                    </motion.div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="apropos" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2">
                  <motion.div
                    className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    À propos de nous
                  </motion.div>
                  <AnimatedText
                    text="Une agence passionnée par la communication"
                    className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                    delay={5}
                  />
                  <motion.p
                    className="text-muted-foreground md:text-xl/relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Fondée récemment par une équipe de passionnés de la communication, AIDA réunit des experts créatifs
                    et stratégiques. Notre mission est d'aider les entreprises à se démarquer grâce à des stratégies
                    innovantes et des créations impactantes.
                  </motion.p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Notre approche</h3>
                  <p className="text-muted-foreground">
                    Nous croyons en une communication authentique et stratégique. Chaque projet commence par une analyse
                    approfondie de votre marque, vos objectifs et votre audience pour créer des solutions sur mesure qui
                    génèrent des résultats concrets.
                  </p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link href="/equipe">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onMouseEnter={enterButton}
                      onMouseLeave={leaveButton}
                    >
                      Notre équipe
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    Notre histoire
                  </Button>
                </motion.div>
              </motion.div>
              <ParallaxSection baseVelocity={0.5} className="flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
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
                    src="/placeholder.svg?height=550&width=550"
                    width={550}
                    height={550}
                    alt="L'équipe AgenceCom"
                    className="rounded-lg object-cover relative z-10"
                  />
                </motion.div>
              </ParallaxSection>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 btn-gradient text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]" />
          </motion.div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              className="flex flex-col items-center justify-center space-y-8 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <AnimatedText
                text="Notre approche AIDA pour votre communication"
                className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                delay={1}
              />
              <motion.p
                className="max-w-[800px] text-white/80 md:text-xl/relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Notre nom n'est pas un hasard. Nous suivons le modèle AIDA pour créer des communications qui captivent
                et convertissent.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
              {[
                {
                  letter: "A",
                  title: "Attention",
                  description: "Capter l'attention de votre audience cible avec des visuels et messages percutants",
                },
                {
                  letter: "I",
                  title: "Intérêt",
                  description: "Susciter l'intérêt en démontrant la valeur unique de votre offre",
                },
                {
                  letter: "D",
                  title: "Désir",
                  description: "Créer un désir fort pour votre produit ou service grâce à un storytelling émotionnel",
                },
                {
                  letter: "A",
                  title: "Action",
                  description: "Inciter à l'action avec des appels clairs et convaincants",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-start space-y-4 text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <motion.div
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-blue-600 text-2xl font-bold"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.letter}
                  </motion.div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-white/80">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Contact
                </motion.div>
                <AnimatedText
                  text="Parlons de votre projet"
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                  delay={6}
                />
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Vous avez un projet en tête ? Contactez-nous pour en discuter et découvrir comment nous pouvons vous
                  aider.
                </motion.p>
              </div>
            </motion.div>

            {/* Message de statut */}
            {contactStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto my-6"
              >
                <Alert variant={contactStatus.type === "success" ? "default" : "destructive"}>
                  {contactStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{contactStatus.message}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: <Phone className="h-5 w-5 text-primary" />,
                    title: "Téléphone",
                    content: "+33 1 23 45 67 89",
                  },
                  {
                    icon: <MessageSquare className="h-5 w-5 text-primary" />,
                    title: "Email",
                    content: "contact@agencecom.fr",
                  },
                  {
                    icon: <Globe className="h-5 w-5 text-primary" />,
                    title: "Adresse",
                    content: "123 Avenue de la Communication, 75001 Paris",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="rounded-full bg-primary/10 p-2"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-muted-foreground">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-medium">Suivez-nous</h3>
                  <div className="flex space-x-4">
                    {[
                      { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
                      { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                      { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
                    ].map((social, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1, y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Link href="#" className="rounded-full bg-muted p-2 hover:bg-blue-100 transition-colors">
                          {social.icon}
                          <span className="sr-only">{social.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                className="rounded-lg border p-6 shadow-sm"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                }}
              >
                <h3 className="text-lg font-medium mb-4">Envoyez-nous un message</h3>
                <form ref={contactFormRef} onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <label
                        htmlFor="nom"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Nom
                      </label>
                      <Input
                        id="nom"
                        name="nom"
                        placeholder="Votre nom"
                        className="border-blue-200 focus:border-blue-500"
                        required
                      />
                    </motion.div>
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Votre email"
                        className="border-blue-200 focus:border-blue-500"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <label
                      htmlFor="sujet"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sujet
                    </label>
                    <Input
                      id="sujet"
                      name="sujet"
                      placeholder="Sujet de votre message"
                      className="border-blue-200 focus:border-blue-500"
                      required
                    />
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Votre message"
                      className="min-h-[100px] border-blue-200 focus:border-blue-500"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      type="submit"
                      className="w-full btn-gradient text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                      onMouseEnter={enterButton}
                      onMouseLeave={leaveButton}
                    >
                      Envoyer
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted relative overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </motion.div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <AnimatedText
                  text="Prêt à transformer votre communication ?"
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                  delay={7}
                />
                <motion.p
                  className="max-w-[600px] text-muted-foreground md:text-xl/relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous
                  aider à atteindre vos objectifs.
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col gap-2 min-[400px]:flex-row"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href="/devis">
                  <Button
                    size="lg"
                    className="px-8 btn-gradient text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    Demander un devis
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 border-blue-500 text-blue-600 hover:bg-blue-50"
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    Découvrir nos services
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-full border-t bg-background py-6 md:py-12"
      >
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <PenTool className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gradient">AIDA</span>
          </motion.div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AIDA. Tous droits réservés.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            {[
              { name: "Mentions légales", href: "#" },
              { name: "Politique de confidentialité", href: "#" },
              { name: "FAQ", href: "/faq" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href={item.href} className="text-sm font-medium hover:text-blue-600 transition-colors">
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </motion.footer>

      <ScrollToTop />
    </div>
  )
}
