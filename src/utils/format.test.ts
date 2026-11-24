import { describe, expect, it } from 'vitest'
import { plural } from './format'

describe('plural', () => {
  const forms: [string, string, string] = ['доска', 'доски', 'досок']
  it.each([
    [1, 'доска'], [2, 'доски'], [5, 'досок'], [11, 'досок'], [21, 'доска'], [22, 'доски'], [112, 'досок'],
  ])('%i → %s', (n, expected) => {
    expect(plural(n, forms)).toBe(expected)
  })
})
