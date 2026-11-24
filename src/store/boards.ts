import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Board, BoardDraft, Column } from '../types'
import { moveItem } from '../utils/array'
import { createId } from '../utils/id'
import { createDemoBoards, createDemoColumns, DEFAULT_COLUMNS } from './demo'

interface BoardsState {
  boards: Board[]
  columns: Column[]
  addBoard: (draft: BoardDraft) => Board
  updateBoard: (id: string, draft: BoardDraft) => void
  removeBoard: (id: string) => void
  addColumn: (boardId: string, title: string) => void
  renameColumn: (id: string, title: string) => void
  removeColumn: (id: string) => void
  moveColumn: (id: string, direction: -1 | 1) => void
  resetDemo: () => void
}

const clean = (draft: BoardDraft) => ({ ...draft, title: draft.title.trim(), description: draft.description.trim() })

// Хранилище досок и колонок. persist сам сохраняет состояние в localStorage и восстанавливает при загрузке.
export const useBoardsStore = create<BoardsState>()(
  persist(
    (set, get) => ({
      boards: createDemoBoards(),
      columns: createDemoColumns(),

      addBoard: (draft) => {
        const board: Board = { id: createId(), ...clean(draft), createdAt: new Date().toISOString() }
        // У новой доски сразу три стандартные колонки
        const columns = DEFAULT_COLUMNS.map((title) => ({ id: createId(), boardId: board.id, title }))
        set((s) => ({ boards: [...s.boards, board], columns: [...s.columns, ...columns] }))
        return board
      },
      updateBoard: (id, draft) =>
        set((s) => ({ boards: s.boards.map((b) => (b.id === id ? { ...b, ...clean(draft) } : b)) })),
      // Вместе с доской удаляем и её колонки
      removeBoard: (id) =>
        set((s) => ({ boards: s.boards.filter((b) => b.id !== id), columns: s.columns.filter((c) => c.boardId !== id) })),

      addColumn: (boardId, title) =>
        set((s) => ({ columns: [...s.columns, { id: createId(), boardId, title: title.trim() }] })),
      renameColumn: (id, title) =>
        set((s) => ({ columns: s.columns.map((c) => (c.id === id ? { ...c, title: title.trim() } : c)) })),
      removeColumn: (id) => set((s) => ({ columns: s.columns.filter((c) => c.id !== id) })),
      // Сдвигаем колонку влево или вправо среди колонок той же доски
      moveColumn: (id, direction) => {
        const { columns } = get()
        const column = columns.find((c) => c.id === id)
        if (!column) return
        const own = columns.filter((c) => c.boardId === column.boardId)
        const from = own.indexOf(column)
        const reordered = moveItem(own, from, from + direction)
        const others = columns.filter((c) => c.boardId !== column.boardId)
        set({ columns: [...others, ...reordered] })
      },

      resetDemo: () => set({ boards: createDemoBoards(), columns: createDemoColumns() }),
    }),
    {
      name: 'taskflow:boards',
      version: 2,
      // В первой версии колонок не было — начинаем с демо-данных
      migrate: () => ({ boards: createDemoBoards(), columns: createDemoColumns() }),
    },
  ),
)

// Колонки одной доски в нужном порядке
export const selectColumns = (boardId: string) => (s: BoardsState) => s.columns.filter((c) => c.boardId === boardId)
