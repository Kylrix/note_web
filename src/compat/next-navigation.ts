import { useLocation, useNavigate, useParams as useTanStackParams } from '@tanstack/react-router'

export function useRouter() {
  const navigate = useNavigate()

  return {
    push: (to: string) => navigate({ to }),
    replace: (to: string) => navigate({ to, replace: true }),
    back: () => window.history.back(),
    refresh: () => window.location.reload(),
  }
}

export function usePathname() {
  return useLocation().pathname
}

export function useSearchParams() {
  const search = useLocation().searchStr ?? ''
  return new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
}

export function useParams() {
  return useTanStackParams({ strict: false }) as Record<string, string>
}
