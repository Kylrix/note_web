import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/landing')({
  component: LandingRedirect,
})

function LandingRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/', replace: true })
  }, [navigate])

  return null
}
