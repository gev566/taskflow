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

export const PRIORITIES = ['low', 'medium', 'high'] as const
export type Priority = (typeof PRIORITIES)[number]

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

// Задача лежит в колонке. Порядок задач в колонке — порядок в массиве.
export interface Task {
  id: string
  columnId: string
  title: string
  description: string
  priority: Priority
  dueDate: string | null // 'YYYY-MM-DD' или null, если срока нет
  tags: string[]
  createdAt: string
}

// Поля формы задачи. Метки вводятся одной строкой через запятую.
export interface TaskDraft {
  title: string
  description: string
  priority: Priority
  dueDate: string
  tags: string
  columnId: string
}
