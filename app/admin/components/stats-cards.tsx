// components/stats-cards.tsx
import {
  BarChart3,
  Clock,
  FileText,
  CheckCircle,
  Users,
  FileArchive,
  FolderKanban,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardsProps {
  stats: Partial<{
    total: number
    nouveau: number
    en_cours: number
    termine: number
    clients: number
    documents: number
    projets: number
  }>
}

export function StatsCards({ stats }: StatsCardsProps) {
  const {
    total = 0,
    nouveau = 0,
    en_cours = 0,
    termine = 0,
    clients = 0,
    documents = 0,
    projets = 0,
  } = stats ?? {}

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {/* total devis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des devis</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">Nombre total de devis reçus</p>
        </CardContent>
      </Card>

      {/* nouveaux */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux devis</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nouveau}</div>
          <p className="text-xs text-muted-foreground">Devis en attente de traitement</p>
        </CardContent>
      </Card>

      {/* en cours */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <BarChart3 className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{en_cours}</div>
          <p className="text-xs text-muted-foreground">Devis en cours de traitement</p>
        </CardContent>
      </Card>

      {/* terminés */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Terminés</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{termine}</div>
          <p className="text-xs text-muted-foreground">Devis traités et terminés</p>
        </CardContent>
      </Card>

      {/* clients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients</CardTitle>
          <Users className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clients}</div>
          <p className="text-xs text-muted-foreground">Nombre total de clients</p>
        </CardContent>
      </Card>

      {/* documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documents</CardTitle>
          <FileArchive className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{documents}</div>
          <p className="text-xs text-muted-foreground">Documents stockés</p>
        </CardContent>
      </Card>

      {
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projets</CardTitle>
          <FolderKanban className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projets}</div>
          <p className="text-xs text-muted-foreground">Projets en base</p>
        </CardContent>
      </Card>
      }
    </div>
  )
}
