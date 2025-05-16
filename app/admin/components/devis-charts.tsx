"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import { format, subDays, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

type Devis = {
  id: string
  nom: string
  email: string
  services: string[]
  budget: string
  statut: string
  date_creation: string
}

interface DevisChartsProps {
  devis: Devis[]
  chartType?: "status" | "services" | "budget" | "timeline" | "all"
}

export function DevisCharts({ devis, chartType = "all" }: DevisChartsProps) {
  const [activeTab, setActiveTab] = useState(chartType === "all" ? "status" : chartType)

  // Préparer les données pour le graphique des statuts
  const statusData = [
    { name: "Nouveau", value: devis.filter((d) => d.statut === "nouveau").length, color: "#3b82f6" },
    { name: "En cours", value: devis.filter((d) => d.statut === "en_cours").length, color: "#eab308" },
    { name: "Terminé", value: devis.filter((d) => d.statut === "termine").length, color: "#22c55e" },
  ].filter((item) => item.value > 0)

  // Préparer les données pour le graphique des services
  const servicesMap = new Map<string, number>()
  devis.forEach((d) => {
    d.services.forEach((service) => {
      servicesMap.set(service, (servicesMap.get(service) || 0) + 1)
    })
  })

  const servicesData = Array.from(servicesMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Préparer les données pour le graphique des budgets
  const budgetMap = new Map<string, number>([
    ["moins-5k", 0],
    ["5k-10k", 0],
    ["10k-20k", 0],
    ["plus-20k", 0],
  ])

  devis.forEach((d) => {
    if (budgetMap.has(d.budget)) {
      budgetMap.set(d.budget, (budgetMap.get(d.budget) || 0) + 1)
    }
  })

  const budgetData = [
    { name: "< 5 000 €", value: budgetMap.get("moins-5k") || 0, color: "#60a5fa" },
    { name: "5 000 € - 10 000 €", value: budgetMap.get("5k-10k") || 0, color: "#3b82f6" },
    { name: "10 000 € - 20 000 €", value: budgetMap.get("10k-20k") || 0, color: "#2563eb" },
    { name: "> 20 000 €", value: budgetMap.get("plus-20k") || 0, color: "#1d4ed8" },
  ].filter((item) => item.value > 0)

  // Préparer les données pour le graphique chronologique
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i)
    return {
      date,
      dateString: format(date, "yyyy-MM-dd"),
      name: format(date, "dd MMM", { locale: fr }),
      count: 0,
    }
  }).reverse()

  devis.forEach((d) => {
    try {
      const devisDate = parseISO(d.date_creation)
      const dateString = format(devisDate, "yyyy-MM-dd")
      const dayIndex = last30Days.findIndex((day) => day.dateString === dateString)
      if (dayIndex !== -1) {
        last30Days[dayIndex].count++
      }
    } catch (error) {
      console.error("Erreur lors du parsing de la date:", error)
    }
  })

  // Filtrer les jours sans données pour un graphique plus propre
  const timelineData = last30Days.filter((day) => day.count > 0)

  // Si aucun type de graphique n'est spécifié, afficher tous les graphiques
  if (chartType === "status") {
    return renderStatusChart()
  } else if (chartType === "services") {
    return renderServicesChart()
  } else if (chartType === "budget") {
    return renderBudgetChart()
  } else if (chartType === "timeline") {
    return renderTimelineChart()
  }

  // Afficher tous les graphiques avec des onglets
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="status">Statuts</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="budget">Budgets</TabsTrigger>
        <TabsTrigger value="timeline">Chronologie</TabsTrigger>
      </TabsList>
      <TabsContent value="status">{renderStatusChart()}</TabsContent>
      <TabsContent value="services">{renderServicesChart()}</TabsContent>
      <TabsContent value="budget">{renderBudgetChart()}</TabsContent>
      <TabsContent value="timeline">{renderTimelineChart()}</TabsContent>
    </Tabs>
  )

  function renderStatusChart() {
    return (
      <div className="h-80">
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    )
  }

  function renderServicesChart() {
    return (
      <div className="h-80">
        {servicesData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={servicesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Nombre de demandes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    )
  }

  function renderBudgetChart() {
    return (
      <div className="h-80">
        {budgetData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    )
  }

  function renderTimelineChart() {
    return (
      <div className="h-80">
        {timelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="Nombre de devis" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    )
  }
}
