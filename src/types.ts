// Основные сущности приложения

export type BoardColor = 'violet' | 'blue' | 'green' | 'orange' | 'pink'

export interface Board {
  id: string
  title: string
  description: string
  color: BoardColor
  createdAt: string // ISO-дата
}
