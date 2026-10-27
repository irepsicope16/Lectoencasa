import { FadeIn, PageHeader } from '@/components/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useConsultant } from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { CareerMapTab } from '@/features/consultants/tabs/CareerMapTab'
import { ComparadorTab } from '@/features/consultants/tabs/ComparadorTab'

export default function MyCareersPage() {
  const user = useAuthStore((s) => s.user)
  const { data: consultant, isLoading } = useConsultant(user?.consultantId)

  if (isLoading) return null
  if (!consultant) {
    return (
      <div className="py-20 text-center text-sm text-faint">
        Todavía no encontramos tu ficha. Avisale a tu profesional.
      </div>
    )
  }

  return (
    <FadeIn>
      <PageHeader
        title="Carreras"
        subtitle="Explorá campos de estudio y trabajo, y después compará tus finalistas con tus propios criterios."
      />
      <Tabs defaultValue="mapa">
        <TabsList>
          <TabsTrigger value="mapa">Mapa de Carreras</TabsTrigger>
          <TabsTrigger value="comparador">Comparador</TabsTrigger>
        </TabsList>
        <TabsContent value="mapa"><CareerMapTab consultant={consultant} /></TabsContent>
        <TabsContent value="comparador"><ComparadorTab consultant={consultant} /></TabsContent>
      </Tabs>
    </FadeIn>
  )
}
