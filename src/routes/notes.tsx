import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import NotesPage from '@/app/(app)/notes/page'

export const Route = createFileRoute('/notes')({
  component: NotesRoute,
})

function NotesRoute() {
  return (
    <AppLayoutShell>
      <NotesPage />
    </AppLayoutShell>
  )
}
