import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import SettingsPage from '@/app/(app)/settings/page'

export const Route = createFileRoute('/settings')({
  component: SettingsRoute,
})

function SettingsRoute() {
  return (
    <AppLayoutShell>
      <SettingsPage />
    </AppLayoutShell>
  )
}
