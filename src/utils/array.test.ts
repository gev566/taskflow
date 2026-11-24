import { describe, expect, it } from 'vitest'
import { moveItem } from './array'

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
