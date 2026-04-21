import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/shared')({
  component: SharedRoute,
})

function SharedRoute() {
  return <Outlet />
}
