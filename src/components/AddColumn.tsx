import { useState, type FormEvent } from 'react'
import { validateColumnTitle } from '../utils/validation'

interface AddColumnProps {
  existingTitles: string[]
  onAdd: (title: string) => void
}

export function AddColumn({ existingTitles, onAdd }: AddColumnProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const error = submitted ? validateColumnTitle(title, existingTitles) : ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (validateColumnTitle(title, existingTitles)) return
    onAdd(title)
    setTitle('')
    setSubmitted(false)
  }

  if (!open) {
    return (
      <button type="button" className="add-column" onClick={() => setOpen(true)}>
        + Добавить колонку
      </button>
    )
  }

  return (
    <form className="add-column add-column--open" noValidate onSubmit={submit}>
      <input
        autoFocus
        aria-label="Название новой колонки"
        placeholder="Название колонки"
        value={title}
        aria-invalid={error ? true : undefined}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      />
      {error && <small className="error">{error}</small>}
      <div className="form-actions">
        <button type="button" className="btn" onClick={() => setOpen(false)}>
          Отмена
        </button>
        <button type="submit" className="btn btn--primary">
          Добавить
        </button>
      </div>
    </form>
  )
}
