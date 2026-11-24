import { beforeEach, describe, expect, it } from 'vitest'
import { selectColumns, useBoardsStore } from './boards'

const store = () => useBoardsStore.getState()
const titlesOf = (boardId: string) => selectColumns(boardId)(store()).map((c) => c.title)

describe('useBoardsStore', () => {
  beforeEach(() => store().resetDemo())

  it('добавляет доску со стандартными колонками и обрезает пробелы', () => {
    const board = store().addBoard({ title: '  Новая  ', description: ' описание ', color: 'pink' })
    expect(store().boards[store().boards.length - 1]).toEqual(board)
    expect(board.title).toBe('Новая')
    expect(board.description).toBe('описание')
    expect(titlesOf(board.id)).toEqual(['К выполнению', 'В работе', 'Готово'])
  })

  it('обновляет доску', () => {
    store().updateBoard('site', { title: 'Сайт', description: '', color: 'orange' })
    expect(store().boards.find((b) => b.id === 'site')).toMatchObject({ title: 'Сайт', color: 'orange' })
  })

  it('удаляет доску вместе с её колонками', () => {
    store().removeBoard('site')
    expect(store().boards.some((b) => b.id === 'site')).toBe(false)
    expect(titlesOf('site')).toEqual([])
    expect(titlesOf('mobile')).toHaveLength(3)
  })

  it('добавляет, переименовывает и удаляет колонку', () => {
    store().addColumn('mobile', ' Тестирование ')
    expect(titlesOf('mobile')).toEqual(['К выполнению', 'В работе', 'Готово', 'Тестирование'])
    store().renameColumn('mobile-2', 'В разработке')
    expect(titlesOf('mobile')[1]).toBe('В разработке')
    store().removeColumn('mobile-1')
    expect(titlesOf('mobile')).toEqual(['В разработке', 'Готово', 'Тестирование'])
  })

  it('сдвигает колонку только внутри своей доски', () => {
    store().moveColumn('mobile-1', 1)
    expect(titlesOf('mobile')).toEqual(['В работе', 'К выполнению', 'Готово'])
    store().moveColumn('mobile-1', -1)
    store().moveColumn('mobile-1', -1) // уже первая — ничего не меняется
    expect(titlesOf('mobile')).toEqual(['К выполнению', 'В работе', 'Готово'])
    expect(titlesOf('site')).toHaveLength(5)
  })
})

describe('задачи', () => {
  beforeEach(() => store().resetDemo())
  const tasksIn = (columnId: string) => store().tasks.filter((t) => t.columnId === columnId)

  it('создаёт, меняет и удаляет задачу', () => {
    const task = store().addTask({ title: ' Новая ', description: '', priority: 'high', dueDate: '', tags: 'Api', columnId: 'mobile-2' })
    expect(task).toMatchObject({ title: 'Новая', priority: 'high', dueDate: null, tags: ['api'] })
    store().updateTask(task.id, { title: 'Новая', description: 'd', priority: 'low', dueDate: '2026-12-01', tags: '', columnId: 'mobile-3' })
    expect(store().tasks.find((t) => t.id === task.id)).toMatchObject({ columnId: 'mobile-3', priority: 'low', dueDate: '2026-12-01' })
    store().removeTask(task.id)
    expect(store().tasks.some((t) => t.id === task.id)).toBe(false)
  })

  it('удаление колонки удаляет её задачи', () => {
    expect(tasksIn('site-2').length).toBeGreaterThan(0)
    store().removeColumn('site-2')
    expect(tasksIn('site-2')).toEqual([])
  })

  it('удаление доски удаляет задачи всех её колонок', () => {
    store().removeBoard('personal')
    expect(store().tasks.some((t) => t.columnId.startsWith('personal-'))).toBe(false)
    expect(store().tasks.some((t) => t.columnId.startsWith('site-'))).toBe(true)
  })
})

describe('перетаскивание задач', () => {
  beforeEach(() => store().resetDemo())
  it('moveTask переносит задачу в другую колонку на нужную позицию', () => {
    store().moveTask('task-1', 'site-2', 1) // «Тёмная тема» встаёт второй в «К выполнению»
    const titles = store().tasks.filter((t) => t.columnId === 'site-2').map((t) => t.title)
    expect(titles).toEqual(['Новая главная страница', 'Тёмная тема для всего сайта', 'Фильтры в каталоге'])
  })
})
