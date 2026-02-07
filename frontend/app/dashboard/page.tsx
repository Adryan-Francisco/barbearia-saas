import { AppHeader } from "@/components/app-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { TopServices } from "@/components/dashboard/top-services"

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" description="Visao geral da sua barbearia" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <UpcomingAppointments />
          </div>
          <TopServices />
        </div>
      </div>
    </>
  )
}
