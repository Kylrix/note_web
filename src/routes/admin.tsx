import { createFileRoute } from '@tanstack/react-router'
import AppLayoutContent from '@/app/(app)/AppLayoutContent'
import AdminDashboard from '@/app/admin/(protected)/dashboard/page'

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
})

function AdminRoute() {
  return (
    <AppLayoutContent>
      <AdminDashboard />
    </AppLayoutContent>
  )
}
