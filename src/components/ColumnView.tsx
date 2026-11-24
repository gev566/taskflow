import { useState, type FormEvent } from 'react'
import type { Column, Task } from '../types'
import { TaskCard } from './TaskCard'
import { validateColumnTitle } from '../utils/validation'

interface ColumnViewProps {
  column: Column
  tasks: Task[]
  index: number
  total: number
  siblingTitles: string[] // названия остальных колонок доски — для проверки на дубли
  onRename: (title: string) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
  onAddTask: () => void
  onOpenTask: (task: Task) => void
}

// Колонка доски. Название меняется по клику — прямо на месте.
export function ColumnView({ column, tasks, index, total, siblingTitles, onRename, onMove, onRemove, onAddTask, onOpenTask }: ColumnViewProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const error = editing ? validateColumnTitle(title, siblingTitles) : ''

  const save = (e?: FormEvent) => {
    e?.preventDefault()
    if (error) return
    onRename(title)
    setEditing(false)
  }

  const cancel = () => {
    setTitle(column.title)
    setEditing(false)
  }

  return (
    <section className="column" aria-label={column.title}>
      <header className="column-head">
        {editing ? (
          <form onSubmit={save} className="column-rename">
            <input
              autoFocus
              aria-label="Название колонки"
              value={title}
              aria-invalid={error ? true : undefined}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && cancel()}
              onBlur={() => (error ? cancel() : save())}
            />
            {error && <small className="error">{error}</small>}
          </form>
        ) : (
          <button type="button" className="column-title" title="Переименовать" onClick={() => setEditing(true)}>
            {column.title}
          </button>
        )}
        <span className="column-count" aria-label="Задач в колонке">{tasks.length}</span>
      </header>

      <div className="column-body">
        {tasks.length === 0 ? (
          <p className="column-empty">Задач нет</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard task={task} onOpen={() => onOpenTask(task)} />
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="add-task" onClick={onAddTask}>
          + Добавить задачу
        </button>
      </div>

      <footer className="column-actions">
        <button type="button" className="icon-btn" aria-label="Сдвинуть влево" disabled={index === 0} onClick={() => onMove(-1)}>
          ←
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Сдвинуть вправо"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
        >
          →
        </button>
        <button type="button" className="icon-btn icon-btn--danger" aria-label={`Удалить колонку «${column.title}»`} onClick={onRemove}>
          ✕
        </button>
      </footer>
    </section>
  )
}
