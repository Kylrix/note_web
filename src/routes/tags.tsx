import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import TagsPage from '@/app/(app)/tags/page'

export const Route = createFileRoute('/tags')({
  component: TagsRoute,
})

function TagsRoute() {
  return (
    <AppLayoutShell>
      <TagsPage />
    </AppLayoutShell>
  )
}
