import { PRIORITIES, type Priority, type Task } from '../types'
import { dueStatus, toDateKey } from './tasks'

export const DUE_FILTERS = ['all', 'overdue', 'today', 'week', 'none'] as const
export type DueFilter = (typeof DUE_FILTERS)[number]

export const DUE_FILTER_LABELS: Record<DueFilter, string> = {
  all: 'Все сроки',
  overdue: 'Просрочено',
  today: 'Сегодня',
  week: 'На 7 дней',
  none: 'Без срока',
}

export interface TaskFilters {
  query: string
  priority: Priority | 'all'
  tag: string // '' — любая метка
  due: DueFilter
}

export const EMPTY_FILTERS: TaskFilters = { query: '', priority: 'all', tag: '', due: 'all' }

export function isFiltering(f: TaskFilters): boolean {
  return f.query.trim() !== '' || f.priority !== 'all' || f.tag !== '' || f.due !== 'all'
}

// Фильтры читаются из адресной строки: так ссылкой можно поделиться, а «назад» в браузере работает
export function filtersFromParams(params: URLSearchParams): TaskFilters {
  const priority = params.get('priority') as Priority | null
  const due = params.get('due') as DueFilter | null
  return {
    query: params.get('q') ?? '',
    priority: priority && PRIORITIES.includes(priority) ? priority : 'all',
    tag: params.get('tag') ?? '',
    due: due && DUE_FILTERS.includes(due) ? due : 'all',
  }
}

export function filtersToParams(f: TaskFilters): Record<string, string> {
  const params: Record<string, string> = {}
  if (f.query.trim()) params.q = f.query
  if (f.priority !== 'all') params.priority = f.priority
  if (f.tag) params.tag = f.tag
  if (f.due !== 'all') params.due = f.due
  return params
}

function matchesDue(task: Task, due: DueFilter, today: Date): boolean {
  if (due === 'all') return true
  if (due === 'none') return task.dueDate === null
  const status = dueStatus(task.dueDate, today)
  if (due === 'overdue') return status === 'overdue'
  if (due === 'today') return status === 'today'
  // 'week': от сегодня до +7 дней включительно
  if (!task.dueDate) return false
  const end = toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7))
  return task.dueDate >= toDateKey(today) && task.dueDate <= end
}

export function filterTasks(tasks: Task[], f: TaskFilters, today: Date = new Date()): Task[] {
  const q = f.query.trim().toLowerCase()
  return tasks.filter(
    (t) =>
      (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q))) &&
      (f.priority === 'all' || t.priority === f.priority) &&
      (!f.tag || t.tags.includes(f.tag)) &&
      matchesDue(t, f.due, today),
  )
}

// Все метки задач доски по алфавиту — для выпадающего списка
export function collectTags(tasks: Task[]): string[] {
  return [...new Set(tasks.flatMap((t) => t.tags))].sort((a, b) => a.localeCompare(b, 'ru'))
}
