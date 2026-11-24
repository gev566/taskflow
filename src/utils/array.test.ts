import { describe, expect, it } from 'vitest'
import { moveItem, moveToColumn } from './array'

describe('moveItem', () => {
  it('переставляет элемент', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })
  it('не меняет исходный массив и игнорирует выход за границы', () => {
    const items = ['a', 'b']
    expect(moveItem(items, 0, 5)).toEqual(['a', 'b'])
    expect(moveItem(items, 1, 0)).not.toBe(items)
    expect(items).toEqual(['a', 'b'])
  })
})

describe('moveToColumn', () => {
  const tasks = [
    { id: 'a', columnId: 'todo' },
    { id: 'b', columnId: 'todo' },
    { id: 'c', columnId: 'done' },
    { id: 'd', columnId: 'todo' },
  ]
  const ids = (list: typeof tasks, col: string) => list.filter((t) => t.columnId === col).map((t) => t.id)

  it('меняет порядок внутри колонки', () => {
    expect(ids(moveToColumn(tasks, 'a', 'todo', 2), 'todo')).toEqual(['b', 'd', 'a'])
    expect(ids(moveToColumn(tasks, 'd', 'todo', 0), 'todo')).toEqual(['d', 'a', 'b'])
  })
  it('переносит в другую колонку на нужное место', () => {
    const result = moveToColumn(tasks, 'b', 'done', 0)
    expect(ids(result, 'done')).toEqual(['b', 'c'])
    expect(ids(result, 'todo')).toEqual(['a', 'd'])
  })
  it('в пустую колонку и за пределы — в конец', () => {
    expect(ids(moveToColumn(tasks, 'a', 'empty', 3), 'empty')).toEqual(['a'])
    expect(ids(moveToColumn(tasks, 'a', 'done', 99), 'done')).toEqual(['c', 'a'])
  })
  it('не меняет исходный массив', () => {
    moveToColumn(tasks, 'a', 'done', 0)
    expect(tasks[0]).toEqual({ id: 'a', columnId: 'todo' })
  })
})
