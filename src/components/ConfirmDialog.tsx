import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  text: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, text, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="muted">{text}</p>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Отмена
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
