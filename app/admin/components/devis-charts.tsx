"use client"

import { useEffect, useState } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { format, subDays } from "date-fns"
import { fr } from "date-fns/locale"

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface DevisChartsProps {
  devis: any[]
}

export function DevisCharts({ devis }: DevisChartsProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    if (devis.length > 0) {
      prepareChartData()
    }
  }, [devis])

  const prepareChartData = () => {
    // Données pour le graphique en anneau (statuts)
    const statusCounts = {
      nouveau: devis.filter((d) => d.statut === "nouveau").length,
      en_cours: devis.filter((d) => d.statut === "en_cours").length,
      termine: devis.filter((d) => d.statut === "termine").length,
    }

    // Données pour le graphique en barres (derniers 7 jours)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i)
      return {
        date,
        dateString: format(date, "yyyy-MM-dd"),
        label: format(date, "dd MMM", { locale: fr }),
      }
    }).reverse()

    const dailyCounts = last7Days.map((day) => {
      return devis.filter((d) => {
        const devisDate = new Date(d.date_creation)
        return format(devisDate, "yyyy-MM-dd") === day.dateString
      }).length
    })

    // Données pour le graphique en barres (services)
    const serviceMap = new Map()
    devis.forEach((d) => {
      d.services.forEach((service: string) => {
        serviceMap.set(service, (serviceMap.get(service) || 0) + 1)
      })
    })

    const serviceLabels = Array.from(serviceMap.keys())
    const serviceCounts = serviceLabels.map((label) => serviceMap.get(label))

    setChartData({
      status: {
        labels: ["Nouveau", "En cours", "Terminé"],
        datasets: [
          {
            data: [statusCounts.nouveau, statusCounts.en_cours, statusCounts.termine],
            backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
            borderColor: ["#2563eb", "#d97706", "#059669"],
            borderWidth: 1,
          },
        ],
      },
      daily: {
        labels: last7Days.map((d) => d.label),
        datasets: [
          {
            label: "Nombre de devis",
            data: dailyCounts,
            backgroundColor: "#3b82f6",
          },
        ],
      },
      services: {
        labels: serviceLabels,
        datasets: [
          {
            label: "Nombre de demandes",
            data: serviceCounts,
            backgroundColor: "#3b82f6",
          },
        ],
      },
    })
  }

  if (!chartData) {
    return <div className="flex h-64 items-center justify-center">Chargement des graphiques...</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">Répartition par statut</h3>
          <div className="h-64">
            <Doughnut
              data={chartData.status}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Devis des 7 derniers jours</h3>
          <div className="h-64">
            <Bar
              data={chartData.daily}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Services demandés</h3>
        <div className="h-64">
          <Bar
            data={chartData.services}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: "y" as const,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
