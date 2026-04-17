import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import SharedNotesPage from '@/app/(app)/shared/page'

export const Route = createFileRoute('/shared')({
  component: SharedRoute,
})

function SharedRoute() {
  return (
    <AppLayoutShell>
      <SharedNotesPage />
    </AppLayoutShell>
  )
}
