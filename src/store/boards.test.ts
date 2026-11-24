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
