import type { Board, Column, Priority, Task } from '../types'
import { toDateKey } from '../utils/tasks'

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

// Демо-задачи. Сроки считаются от сегодняшнего дня, чтобы были и просроченные, и «скоро».
export function createDemoTasks(now = new Date()): Task[] {
  const day = (offset: number) => toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset))
  const created = now.toISOString()
  const rows: [string, string, string, Priority, number | null, string[], string][] = [
    ['site-1', 'Тёмная тема для всего сайта', '', 'low', null, ['дизайн'], 'Собрать референсы и предложить палитру.'],
    ['site-2', 'Новая главная страница', 'Hero, блок преимуществ и отзывы', 'high', 2, ['дизайн', 'frontend'], ''],
    ['site-2', 'Фильтры в каталоге', 'Цена, бренд, наличие', 'medium', 6, ['frontend'], ''],
    ['site-3', 'Корзина: пересчёт итога', 'Скидки и доставка считаются на лету', 'high', 0, ['frontend', 'баг'], ''],
    ['site-4', 'Адаптивное меню', 'Проверить на iPhone SE и планшетах', 'medium', -1, ['frontend'], ''],
    ['site-5', 'Логотип в SVG', '', 'low', null, ['дизайн'], ''],
    ['mobile-1', 'Экран входа по номеру телефона', 'SMS-код и повторная отправка', 'high', 4, ['auth'], ''],
    ['mobile-1', 'Push-уведомления', '', 'medium', 10, [], ''],
    ['mobile-2', 'Каталог: бесконечная прокрутка', '', 'medium', 3, ['api'], ''],
    ['mobile-3', 'Настроить CI для сборок', 'Сборка и тесты на каждый push', 'low', null, ['devops'], ''],
    ['personal-1', 'Курс по TypeScript', 'Главы про дженерики', 'medium', 5, ['учёба'], ''],
    ['personal-2', 'Тренировка', '', 'low', 0, ['спорт'], ''],
    ['personal-3', 'Оплатить интернет', '', 'high', -2, ['дом'], ''],
  ]
  return rows.map(([columnId, title, description, priority, offset, tags, extra], i) => ({
    id: `task-${i + 1}`,
    columnId,
    title,
    description: [description, extra].filter(Boolean).join(' '),
    priority,
    dueDate: offset === null ? null : day(offset),
    tags,
    createdAt: created,
  }))
}
