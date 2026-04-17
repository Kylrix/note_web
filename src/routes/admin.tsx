import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import AdminDashboard from '@/app/admin/(protected)/dashboard/page'

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
})

function AdminRoute() {
  return (
    <AppLayoutShell>
      <AdminDashboard />
    </AppLayoutShell>
  )
}
