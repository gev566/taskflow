import type { Board, Column } from '../types'

export const DEFAULT_COLUMNS = ['К выполнению', 'В работе', 'Готово']

// Демо-данные, чтобы приложение не было пустым при первом открытии
export function createDemoBoards(now = new Date()): Board[] {
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString()
  return [
    { id: 'site', title: 'Редизайн сайта', description: 'Новая главная, каталог и корзина', color: 'violet', createdAt: daysAgo(12) },
    { id: 'mobile', title: 'Мобильное приложение', description: 'MVP для iOS и Android', color: 'blue', createdAt: daysAgo(7) },
    { id: 'personal', title: 'Личные задачи', description: 'Учёба, спорт, дела по дому', color: 'green', createdAt: daysAgo(2) },
  ]
}

export function createDemoColumns(): Column[] {
  const columns: Column[] = []
  const add = (boardId: string, titles: string[]) =>
    titles.forEach((title, i) => columns.push({ id: `${boardId}-${i + 1}`, boardId, title }))
  add('site', ['Идеи', 'К выполнению', 'В работе', 'На проверке', 'Готово'])
  add('mobile', DEFAULT_COLUMNS)
  add('personal', ['На неделе', 'Сегодня', 'Сделано'])
  return columns
}
