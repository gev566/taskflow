import { PRIORITIES, type Column, type Priority, type Task } from '../types'
import { dueStatus } from './tasks'

export interface BoardStats {
  total: number
  done: number // задачи в последней колонке считаем выполненными
  donePercent: number
  overdue: number
  dueToday: number
  noDue: number
  byColumn: { id: string; title: string; count: number }[]
  byPriority: Record<Priority, number>
  topTags: { tag: string; count: number }[]
}

// Вся статистика доски за один проход по задачам
export function boardStats(columns: Column[], tasks: Task[], today: Date = new Date()): BoardStats {
  const byColumnCount = new Map(columns.map((c) => [c.id, 0]))
  const byPriority = Object.fromEntries(PRIORITIES.map((p) => [p, 0])) as Record<Priority, number>
  const tagCount = new Map<string, number>()
  const doneColumn = columns.at(-1)?.id
  let done = 0
  let overdue = 0
  let dueToday = 0
  let noDue = 0

  for (const task of tasks) {
    if (!byColumnCount.has(task.columnId)) continue
    byColumnCount.set(task.columnId, (byColumnCount.get(task.columnId) ?? 0) + 1)
    byPriority[task.priority] += 1
    for (const tag of task.tags) tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1)
    const isDone = task.columnId === doneColumn
    if (isDone) done += 1
    const status = dueStatus(task.dueDate, today)
    // Просрочка и «сегодня» важны только для невыполненных задач
    if (!isDone && status === 'overdue') overdue += 1
    if (!isDone && status === 'today') dueToday += 1
    if (!task.dueDate) noDue += 1
  }

  const total = [...byColumnCount.values()].reduce((a, b) => a + b, 0)
  return {
    total,
    done,
    donePercent: total ? Math.round((done / total) * 100) : 0,
    overdue,
    dueToday,
    noDue,
    byColumn: columns.map((c) => ({ id: c.id, title: c.title, count: byColumnCount.get(c.id) ?? 0 })),
    byPriority,
    topTags: [...tagCount]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ru'))
      .slice(0, 5),
  }
}
