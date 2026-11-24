import { describe, expect, it } from 'vitest'
import type { Column, Task } from '../types'
import { boardStats } from './stats'

const columns: Column[] = [
  { id: 'todo', boardId: 'b', title: 'К выполнению' },
  { id: 'doing', boardId: 'b', title: 'В работе' },
  { id: 'done', boardId: 'b', title: 'Готово' },
]
const task = (patch: Partial<Task>): Task => ({
  id: Math.random().toString(), columnId: 'todo', title: 't', description: '', priority: 'medium', dueDate: null, tags: [], createdAt: '', ...patch,
})
const today = new Date(2026, 10, 24)

describe('boardStats', () => {
  it('считает выполненные, просроченные и распределения', () => {
    const stats = boardStats(
      columns,
      [
        task({ priority: 'high', dueDate: '2026-11-20', tags: ['api'] }),
        task({ columnId: 'doing', dueDate: '2026-11-24', tags: ['api', 'ui'] }),
        task({ columnId: 'done', priority: 'low', dueDate: '2026-11-01', tags: ['ui'] }), // просрочена, но выполнена — не считаем
        task({ columnId: 'done', tags: ['api'] }),
        task({ columnId: 'other-board' }), // чужая колонка — не учитываем
      ],
      today,
    )
    expect(stats).toMatchObject({ total: 4, done: 2, donePercent: 50, overdue: 1, dueToday: 1, noDue: 1 })
    expect(stats.byColumn.map((c) => c.count)).toEqual([1, 1, 2])
    expect(stats.byPriority).toEqual({ low: 1, medium: 2, high: 1 })
    expect(stats.topTags).toEqual([{ tag: 'api', count: 3 }, { tag: 'ui', count: 2 }])
  })

  it('пустая доска', () => {
    expect(boardStats(columns, [], today)).toMatchObject({ total: 0, done: 0, donePercent: 0 })
    expect(boardStats([], [], today).byColumn).toEqual([])
  })
})
