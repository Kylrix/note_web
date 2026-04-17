import { createFileRoute } from '@tanstack/react-router'
import AppLayoutShell from '@/components/AppLayoutShell'
import AttachmentPage from '@/app/(app)/notes/[id]/[attachmentId]/page'

export const Route = createFileRoute('/notes/$id/$attachmentId')({
  component: AttachmentRoute,
})

function AttachmentRoute() {
  return (
    <AppLayoutShell>
      <AttachmentPage />
    </AppLayoutShell>
  )
}
