import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import NotePage from '@/app/(app)/notes/[id]/page'

export const Route = createFileRoute('/notes/$id')({
  component: NoteRoute,
})

function NoteRoute() {
  return (
    <AppLayoutShell>
      <NotePage />
    </AppLayoutShell>
  )
}
