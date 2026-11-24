import type { BoardDraft } from '../types'

export const LIMITS = { boardTitle: 60, boardDescription: 200, columnTitle: 40 } as const

export type BoardErrors = Partial<Record<keyof BoardDraft, string>>

// Проверка формы доски. Пустой объект — ошибок нет.
export function validateBoard(draft: BoardDraft): BoardErrors {
  const errors: BoardErrors = {}
  const title = draft.title.trim()
  if (!title) errors.title = 'Введите название'
  else if (title.length > LIMITS.boardTitle) errors.title = `Не длиннее ${LIMITS.boardTitle} символов`
  if (draft.description.trim().length > LIMITS.boardDescription) {
    errors.description = `Не длиннее ${LIMITS.boardDescription} символов`
  }
  return errors
}

export function validateColumnTitle(title: string, existing: string[]): string {
  const value = title.trim()
  if (!value) return 'Введите название колонки'
  if (value.length > LIMITS.columnTitle) return `Не длиннее ${LIMITS.columnTitle} символов`
  if (existing.some((t) => t.trim().toLowerCase() === value.toLowerCase())) return 'Такая колонка уже есть'
  return ''
}
