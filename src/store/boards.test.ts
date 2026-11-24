import { beforeEach, describe, expect, it } from 'vitest'
import { useBoardsStore } from './boards'

describe('useBoardsStore', () => {
  beforeEach(() => useBoardsStore.getState().resetDemo())

  it('добавляет доску и обрезает пробелы', () => {
    const board = useBoardsStore.getState().addBoard('  Новая  ', ' описание ', 'pink')
    const { boards } = useBoardsStore.getState()
    expect(boards[boards.length - 1]).toEqual(board)
    expect(board.title).toBe('Новая')
    expect(board.description).toBe('описание')
  })

  it('удаляет доску по id', () => {
    useBoardsStore.getState().removeBoard('site')
    expect(useBoardsStore.getState().boards.some((b) => b.id === 'site')).toBe(false)
  })
})
