import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import AdminMessages from '@/app/admin/(protected)/messages/page'

export const Route = createFileRoute('/admin/messages')({
  component: AdminMessagesRoute,
})

function AdminMessagesRoute() {
  return (
    <AppLayoutShell>
      <AdminMessages />
    </AppLayoutShell>
  )
}
