import type { Task, TaskDraft } from '../types'

export const TASK_LIMITS = { title: 120, description: 1000, tags: 5, tag: 20 } as const

// 'дизайн, Срочно,  дизайн ' → ['дизайн', 'срочно']: без пробелов по краям, в нижнем регистре и без повторов
export function parseTags(input: string): string[] {
  const tags = input
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set(tags)]
}

export type TaskErrors = Partial<Record<'title' | 'description' | 'dueDate' | 'tags', string>>

export function validateTask(draft: TaskDraft): TaskErrors {
  const errors: TaskErrors = {}
  const title = draft.title.trim()
  if (!title) errors.title = 'Введите название задачи'
  else if (title.length > TASK_LIMITS.title) errors.title = `Не длиннее ${TASK_LIMITS.title} символов`
  if (draft.description.trim().length > TASK_LIMITS.description) {
    errors.description = `Не длиннее ${TASK_LIMITS.description} символов`
  }
  if (draft.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate)) errors.dueDate = 'Неверная дата'
  const tags = parseTags(draft.tags)
  if (tags.length > TASK_LIMITS.tags) errors.tags = `Не больше ${TASK_LIMITS.tags} меток`
  else if (tags.some((t) => t.length > TASK_LIMITS.tag)) errors.tags = `Метка не длиннее ${TASK_LIMITS.tag} символов`
  return errors
}

export function draftFromTask(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ?? '',
    tags: task.tags.join(', '),
    columnId: task.columnId,
  }
}

export function emptyTaskDraft(columnId: string): TaskDraft {
  return { title: '', description: '', priority: 'medium', dueDate: '', tags: '', columnId }
}

// Поля задачи из формы: обрезаем пробелы, разбираем метки, пустая дата → null
export function taskFieldsFromDraft(draft: TaskDraft) {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    priority: draft.priority,
    dueDate: draft.dueDate || null,
    tags: parseTags(draft.tags),
    columnId: draft.columnId,
  }
}

// Дата в формате 'YYYY-MM-DD' по местному времени (toISOString дал бы UTC и мог сдвинуть день)
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export type DueStatus = 'overdue' | 'today' | 'soon' | 'later'

// Насколько близок срок: просрочено, сегодня, в ближайшие 3 дня или позже
export function dueStatus(dueDate: string | null, today: Date = new Date()): DueStatus | null {
  if (!dueDate) return null
  const todayKey = toDateKey(today)
  if (dueDate < todayKey) return 'overdue'
  if (dueDate === todayKey) return 'today'
  const soon = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)
  return dueDate <= toDateKey(soon) ? 'soon' : 'later'
}

export const DUE_LABELS: Record<DueStatus, string> = {
  overdue: 'Просрочено',
  today: 'Сегодня',
  soon: 'Скоро',
  later: '',
}

const dueFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

export function formatDue(dueDate: string): string {
  const [y, m, d] = dueDate.split('-').map(Number)
  return dueFormat.format(new Date(y, m - 1, d))
}
