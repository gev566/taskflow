import { describe, expect, it } from 'vitest'
import { validateBoard, validateColumnTitle } from './validation'

describe('validateBoard', () => {
  it('требует название', () => {
    expect(validateBoard({ title: '   ', description: '', color: 'blue' })).toEqual({ title: 'Введите название' })
  })
  it('ограничивает длину', () => {
    const errors = validateBoard({ title: 'a'.repeat(61), description: 'b'.repeat(201), color: 'blue' })
    expect(errors.title).toMatch(/60/)
    expect(errors.description).toMatch(/200/)
  })
  it('пропускает корректную доску', () => {
    expect(validateBoard({ title: 'Доска', description: '', color: 'blue' })).toEqual({})
  })
})

describe('validateColumnTitle', () => {
  it('не даёт создать дубль без учёта регистра и пробелов', () => {
    expect(validateColumnTitle(' готово ', ['Готово'])).toBe('Такая колонка уже есть')
  })
  it('требует название', () => {
    expect(validateColumnTitle('', [])).toBe('Введите название колонки')
  })
  it('пропускает новое название', () => {
    expect(validateColumnTitle('Тесты', ['Готово'])).toBe('')
  })
})
