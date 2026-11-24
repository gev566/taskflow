import { useState, type FormEvent } from 'react'
import { PRIORITIES, PRIORITY_LABELS, type Column, type Priority, type TaskDraft } from '../types'
import { TASK_LIMITS, validateTask, type TaskErrors } from '../utils/tasks'

interface TaskFormProps {
  initial: TaskDraft
  columns: Column[]
  submitLabel: string
  onSubmit: (draft: TaskDraft) => void
  onCancel: () => void
  onDelete?: () => void
}

// Форма задачи: название, описание, колонка, приоритет, срок и метки
export function TaskForm({ initial, columns, submitLabel, onSubmit, onCancel, onDelete }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(initial)
  const [submitted, setSubmitted] = useState(false)
  const errors: TaskErrors = submitted ? validateTask(draft) : {}
  const set = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateTask(draft)).length === 0) onSubmit(draft)
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="task-title">Название</label>
        <input
          id="task-title"
          autoFocus
          value={draft.title}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
          onChange={(e) => set('title', e.target.value)}
        />
        {errors.title && <small id="task-title-error" className="error">{errors.title}</small>}
      </div>

      <div className="field">
        <label htmlFor="task-description">
          Описание <span className="muted">(необязательно)</span>
        </label>
        <textarea
          id="task-description"
          rows={3}
          value={draft.description}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby="task-description-hint"
          onChange={(e) => set('description', e.target.value)}
        />
        <small id="task-description-hint" className={errors.description ? 'error' : 'muted'}>
          {errors.description ?? `${draft.description.trim().length} / ${TASK_LIMITS.description}`}
        </small>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="task-column">Колонка</label>
          <select id="task-column" value={draft.columnId} onChange={(e) => set('columnId', e.target.value)}>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="task-priority">Приоритет</label>
          <select id="task-priority" value={draft.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="task-due">Срок</label>
          <input
            id="task-due"
            type="date"
            value={draft.dueDate}
            aria-invalid={errors.dueDate ? true : undefined}
            onChange={(e) => set('dueDate', e.target.value)}
          />
          {errors.dueDate && <small className="error">{errors.dueDate}</small>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="task-tags">
          Метки <span className="muted">(через запятую)</span>
        </label>
        <input
          id="task-tags"
          placeholder="дизайн, срочно"
          value={draft.tags}
          aria-invalid={errors.tags ? true : undefined}
          aria-describedby="task-tags-hint"
          onChange={(e) => set('tags', e.target.value)}
        />
        <small id="task-tags-hint" className={errors.tags ? 'error' : 'muted'}>
          {errors.tags ?? `До ${TASK_LIMITS.tags} меток`}
        </small>
      </div>

      <div className="form-actions">
        {onDelete && (
          <button type="button" className="btn btn--danger-outline form-actions-left" onClick={onDelete}>
            Удалить
          </button>
        )}
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
