import { useState, type FormEvent } from 'react'
import { BOARD_COLOR_LABELS, BOARD_COLORS, type BoardDraft } from '../types'
import { LIMITS, validateBoard, type BoardErrors } from '../utils/validation'

interface BoardFormProps {
  initial?: BoardDraft
  submitLabel: string
  onSubmit: (draft: BoardDraft) => void
  onCancel: () => void
}

const EMPTY: BoardDraft = { title: '', description: '', color: 'violet' }

// Форма создания и редактирования доски. Ошибки показываем после первой попытки сохранить.
export function BoardForm({ initial = EMPTY, submitLabel, onSubmit, onCancel }: BoardFormProps) {
  const [draft, setDraft] = useState<BoardDraft>(initial)
  const [submitted, setSubmitted] = useState(false)
  const errors: BoardErrors = submitted ? validateBoard(draft) : {}

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateBoard(draft)).length === 0) onSubmit(draft)
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="board-title">Название</label>
        <input
          id="board-title"
          autoFocus
          value={draft.title}
          maxLength={LIMITS.boardTitle + 20}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'board-title-error' : undefined}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        {errors.title && <small id="board-title-error" className="error">{errors.title}</small>}
      </div>

      <div className="field">
        <label htmlFor="board-description">
          Описание <span className="muted">(необязательно)</span>
        </label>
        <textarea
          id="board-description"
          rows={3}
          value={draft.description}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby="board-description-hint"
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
        <small id="board-description-hint" className={errors.description ? 'error' : 'muted'}>
          {errors.description ?? `${draft.description.trim().length} / ${LIMITS.boardDescription}`}
        </small>
      </div>

      <fieldset className="field">
        <legend>Цвет</legend>
        <div className="color-options">
          {BOARD_COLORS.map((color) => (
            <label key={color} className={`color-option color-option--${color}`} title={BOARD_COLOR_LABELS[color]}>
              <input
                type="radio"
                name="color"
                value={color}
                checked={draft.color === color}
                onChange={() => setDraft({ ...draft, color })}
              />
              <span className="visually-hidden">{BOARD_COLOR_LABELS[color]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
