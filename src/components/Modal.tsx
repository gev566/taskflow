import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

// Модальное окно на нативном <dialog>: фокус внутри окна и закрытие по Esc браузер даёт сам
export function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal?.()
    if (!open && dialog.open) dialog.close?.()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // Клик по затемнённому фону (сам <dialog>, а не его содержимое) закрывает окно
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {open && (
        <div className="modal-body">
          <div className="modal-head">
            <h2 id="modal-title">{title}</h2>
            <button type="button" className="icon-btn" aria-label="Закрыть" onClick={onClose}>
              ×
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
