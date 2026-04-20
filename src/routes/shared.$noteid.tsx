import { createFileRoute } from '@tanstack/react-router'
import SharedNoteClient from '@/app/shared/[noteid]/SharedNoteClient'

export const Route = createFileRoute('/shared/$noteid')({
  component: SharedNoteRoute,
})

function SharedNoteRoute() {
  const { noteid } = Route.useParams()
  return <SharedNoteClient noteId={noteid} />
}
