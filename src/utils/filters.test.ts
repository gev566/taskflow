import { describe, expect, it } from 'vitest'
import type { Task } from '../types'
import { collectTags, EMPTY_FILTERS, filterTasks, filtersFromParams, filtersToParams, isFiltering } from './filters'

const task = (patch: Partial<Task>): Task => ({
  id: 'x', columnId: 'c', title: 'Задача', description: '', priority: 'medium', dueDate: null, tags: [], createdAt: '', ...patch,
})
const today = new Date(2026, 10, 24)
const tasks = [
  task({ id: '1', title: 'Корзина', priority: 'high', dueDate: '2026-11-23', tags: ['frontend', 'баг'] }),
  task({ id: '2', title: 'Логотип', description: 'SVG версия', priority: 'low', tags: ['дизайн'] }),
  task({ id: '3', title: 'Меню', dueDate: '2026-11-24', tags: ['frontend'] }),
  task({ id: '4', title: 'Каталог', dueDate: '2026-12-01' }),
  task({ id: '5', title: 'Push', dueDate: '2026-12-15' }),
]
const ids = (list: Task[]) => list.map((t) => t.id)

describe('filterTasks', () => {
  it('без фильтров возвращает всё', () => {
    expect(filterTasks(tasks, EMPTY_FILTERS, today)).toHaveLength(5)
  })
  it('ищет по названию, описанию и меткам без учёта регистра', () => {
    expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, query: 'svg' }, today))).toEqual(['2'])
    expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, query: 'БАГ' }, today))).toEqual(['1'])
  })
  it('фильтрует по приоритету и метке вместе', () => {
    expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, priority: 'medium', tag: 'frontend' }, today))).toEqual(['3'])
  })
  it.each([
    ['overdue', ['1']],
    ['today', ['3']],
    ['week', ['3', '4']],
    ['none', ['2']],
  ] as const)('срок %s', (due, expected) => {
    expect(ids(filterTasks(tasks, { ...EMPTY_FILTERS, due }, today))).toEqual(expected)
  })
})

describe('параметры адресной строки', () => {
  it('туда и обратно без потерь, мусор игнорируется', () => {
    const f = { query: 'меню', priority: 'high' as const, tag: 'frontend', due: 'week' as const }
    expect(filtersFromParams(new URLSearchParams(filtersToParams(f)))).toEqual(f)
    expect(filtersFromParams(new URLSearchParams('priority=urgent&due=soon'))).toEqual(EMPTY_FILTERS)
    expect(filtersToParams(EMPTY_FILTERS)).toEqual({})
  })
  it('isFiltering', () => {
    expect(isFiltering(EMPTY_FILTERS)).toBe(false)
    expect(isFiltering({ ...EMPTY_FILTERS, query: '  ' })).toBe(false)
    expect(isFiltering({ ...EMPTY_FILTERS, tag: 'a' })).toBe(true)
  })
})

describe('collectTags', () => {
  it('уникальные метки по алфавиту', () => {
    expect(collectTags(tasks)).toEqual(['баг', 'дизайн', 'frontend'])
  })
})
