import { createFileRoute } from '@tanstack/react-router'
import AppLayoutContent from '@/app/(app)/AppLayoutContent'
import AdminMessages from '@/app/admin/(protected)/messages/page'

export const Route = createFileRoute('/admin/messages')({
  component: AdminMessagesRoute,
})

function AdminMessagesRoute() {
  return (
    <AppLayoutContent>
      <AdminMessages />
    </AppLayoutContent>
  )
}
