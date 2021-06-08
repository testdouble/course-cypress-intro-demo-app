import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export default function useSearchParams() {
  const location = useLocation()

  return useMemo(() => new URLSearchParams(location.search), [location.search])
}
