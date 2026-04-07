import { useLayoutEffect, useRef } from 'react'
import { useAIAssistantMobileAnchor } from './AIAssistantMobileAnchorContext'

type AIAssistantMobileDockAnchorProps = {
  /** Defaults to banner grid cell; use branding-bar class when the myAMU strip is hidden. */
  className?: string
}

/**
 * Mount in the global header on mobile so the cat + launcher align to that strip (banner or gold bar).
 */
export function AIAssistantMobileDockAnchor({ className }: AIAssistantMobileDockAnchorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { setMobileDockAnchorEl } = useAIAssistantMobileAnchor()

  useLayoutEffect(() => {
    const el = ref.current
    setMobileDockAnchorEl(el)
    return () => setMobileDockAnchorEl(null)
  }, [setMobileDockAnchorEl])

  return (
    <div
      ref={ref}
      className={className ?? 'portal-portal-banner__ai-dock-anchor'}
      aria-hidden
    />
  )
}
