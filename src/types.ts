// Основные сущности приложения

export const BOARD_COLORS = ['violet', 'blue', 'green', 'orange', 'pink'] as const
export type BoardColor = (typeof BOARD_COLORS)[number]

export const BOARD_COLOR_LABELS: Record<BoardColor, string> = {
  violet: 'Фиолетовый',
  blue: 'Синий',
  green: 'Зелёный',
  orange: 'Оранжевый',
  pink: 'Розовый',
}

export interface Board {
  id: string
  title: string
  description: string
  color: BoardColor
  createdAt: string // ISO-дата
}

// Колонка принадлежит доске. Порядок колонок — порядок в массиве.
export interface Column {
  id: string
  boardId: string
  title: string
}

// Черновик формы доски — то, что вводит пользователь
export interface BoardDraft {
  title: string
  description: string
  color: BoardColor
}
