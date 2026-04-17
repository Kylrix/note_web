import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import ExtensionsPage from '@/app/(app)/extensions/page'

export const Route = createFileRoute('/extensions')({
  component: ExtensionsRoute,
})

function ExtensionsRoute() {
  return (
    <AppLayoutShell>
      <ExtensionsPage />
    </AppLayoutShell>
  )
}
