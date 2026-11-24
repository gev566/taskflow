import { describe, expect, it } from 'vitest'
import type { TaskDraft } from '../types'
import { dueStatus, parseTags, taskFieldsFromDraft, toDateKey, validateTask } from './tasks'

const draft = (patch: Partial<TaskDraft> = {}): TaskDraft => ({
  title: 'Задача',
  description: '',
  priority: 'medium',
  dueDate: '',
  tags: '',
  columnId: 'c1',
  ...patch,
})

describe('parseTags', () => {
  it('обрезает пробелы, переводит в нижний регистр и убирает повторы', () => {
    expect(parseTags(' Дизайн, срочно ,дизайн,, ')).toEqual(['дизайн', 'срочно'])
  })
})

describe('validateTask', () => {
  it('требует название', () => {
    expect(validateTask(draft({ title: '  ' })).title).toBe('Введите название задачи')
  })
  it('ограничивает число и длину меток', () => {
    expect(validateTask(draft({ tags: 'a,b,c,d,e,f' })).tags).toMatch(/5/)
    expect(validateTask(draft({ tags: 'x'.repeat(21) })).tags).toMatch(/20/)
  })
  it('пропускает корректную задачу', () => {
    expect(validateTask(draft({ dueDate: '2026-12-01', tags: 'api' }))).toEqual({})
  })
})

describe('taskFieldsFromDraft', () => {
  it('пустая дата превращается в null, метки — в массив', () => {
    expect(taskFieldsFromDraft(draft({ title: ' Т ', tags: 'A, b' }))).toMatchObject({ title: 'Т', dueDate: null, tags: ['a', 'b'] })
  })
})

describe('dueStatus', () => {
  const today = new Date(2026, 10, 24) // 24 ноября 2026
  it.each([
    [null, null],
    ['2026-11-23', 'overdue'],
    ['2026-11-24', 'today'],
    ['2026-11-27', 'soon'],
    ['2026-11-28', 'later'],
  ])('%s → %s', (due, expected) => {
    expect(dueStatus(due, today)).toBe(expected)
  })
  it('toDateKey использует местную дату', () => {
    expect(toDateKey(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
  })
})
