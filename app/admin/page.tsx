"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Home, LogOut, Settings, Users } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DevisTable } from "@/app/admin/components/devis-table"
import { StatsCards } from "@/app/admin/components/stats-cards"
import { DevisCharts } from "@/app/admin/components/devis-charts"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [devisList, setDevisList] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    nouveaux: 0,
    enCours: 0,
    termines: 0,
  })
  const router = useRouter()

  useEffect(() => {
    fetchDevis()
  }, [])

  const fetchDevis = async () => {
    try {
      setLoading(true)

      // Récupérer les devis depuis Supabase
      const { data, error } = await supabaseAdmin.from("devis").select("*").order("date_creation", { ascending: false })

      if (error) {
        console.error("Erreur lors de la récupération des devis:", error)
        // Utiliser des données de démonstration en cas d'erreur
        const demoData = generateDemoData()
        setDevisList(demoData)
        calculateStats(demoData)
      } else if (data) {
        setDevisList(data)
        calculateStats(data)
      }
    } catch (err) {
      console.error("Exception lors de la récupération des devis:", err)
      // Utiliser des données de démonstration en cas d'erreur
      const demoData = generateDemoData()
      setDevisList(demoData)
      calculateStats(demoData)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: any[]) => {
    const nouveaux = data.filter((d) => d.statut === "nouveau").length
    const enCours = data.filter((d) => d.statut === "en_cours").length
    const termines = data.filter((d) => d.statut === "termine").length

    setStats({
      total: data.length,
      nouveaux,
      enCours,
      termines,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin/login")
  }

  const generateDemoData = () => {
    // Générer des données de démonstration pour le mode développement
    return Array.from({ length: 15 }, (_, i) => ({
      id: `demo-${i + 1}`,
      nom: `Client ${i + 1}`,
      email: `client${i + 1}@example.com`,
      telephone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      entreprise: `Entreprise ${i + 1}`,
      services: ["Site web", "SEO", "Design"].slice(0, Math.floor(Math.random() * 3) + 1),
      budget: ["< 5 000 €", "5 000 € - 10 000 €", "> 10 000 €"][Math.floor(Math.random() * 3)],
      delai: ["1 mois", "3 mois", "6 mois"][Math.floor(Math.random() * 3)],
      description: `Description du projet ${i + 1}. Ceci est une démonstration.`,
      statut: ["nouveau", "en_cours", "termine"][Math.floor(Math.random() * 3)],
      date_creation: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      date_modification: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white shadow-md md:flex">
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin">
                <Home className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/devis">
                <FileText className="mr-2 h-4 w-4" />
                Devis
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/clients">
                <Users className="mr-2 h-4 w-4" />
                Clients
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </Button>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <h2 className="text-lg font-medium">Tableau de bord</h2>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="md:hidden">
              Menu
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </header>

        <main className="p-6">
          <StatsCards stats={stats} />

          <Tabs defaultValue="devis" className="mt-6">
            <TabsList>
              <TabsTrigger value="devis">Devis récents</TabsTrigger>
              <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
            </TabsList>
            <TabsContent value="devis" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Devis récents</CardTitle>
                  <CardDescription>
                    Liste des derniers devis reçus. Cliquez sur un devis pour voir les détails.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DevisTable devis={devisList} loading={loading} onRefresh={fetchDevis} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="statistiques" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques des devis</CardTitle>
                  <CardDescription>Visualisation des données de devis par statut et par période.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DevisCharts devis={devisList} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
