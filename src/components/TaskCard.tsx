import { PRIORITY_LABELS, type Task } from '../types'
import { DUE_LABELS, dueStatus, formatDue } from '../utils/tasks'

interface TaskCardProps {
  task: Task
  onOpen: () => void
}

// Карточка задачи в колонке. Вся карточка — кнопка, по клику открывается редактирование.
export function TaskCard({ task, onOpen }: TaskCardProps) {
  const status = dueStatus(task.dueDate)
  return (
    <button type="button" className="task-card" onClick={onOpen} aria-label={`Задача «${task.title}»`}>
      <span className="task-top">
        <span className={`priority priority--${task.priority}`} title="Приоритет">
          {PRIORITY_LABELS[task.priority]}
        </span>
        {task.dueDate && (
          <span className={`due due--${status}`} title="Срок">
            {formatDue(task.dueDate)}
            {status && DUE_LABELS[status] && ` · ${DUE_LABELS[status]}`}
          </span>
        )}
      </span>
      <span className="task-title">{task.title}</span>
      {task.description && <span className="task-desc">{task.description}</span>}
      {task.tags.length > 0 && (
        <span className="tags">
          {task.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </span>
      )}
    </button>
  )
}
