import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function DetailPanel({ title, subtitle, open, onClose, children }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    previousFocusRef.current = document.activeElement
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 cursor-default bg-foreground/35"
        aria-label="Cerrar detalle"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-panel-title"
        className="detail-panel translate-x-0"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <p id="detail-panel-title" className="font-display text-lg font-semibold">
              {title}
            </p>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          <Button
            ref={closeRef}
            size="icon"
            variant="ghost"
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-full overflow-y-auto p-5">{children}</div>
      </aside>
    </>
  )
}

export default DetailPanel
