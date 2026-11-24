import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Board, BoardColor } from '../types'
import { createId } from '../utils/id'
import { createDemoBoards } from './demo'

interface BoardsState {
  boards: Board[]
  addBoard: (title: string, description: string, color: BoardColor) => Board
  removeBoard: (id: string) => void
  resetDemo: () => void
}

// Хранилище досок. persist сам сохраняет состояние в localStorage и восстанавливает при загрузке.
export const useBoardsStore = create<BoardsState>()(
  persist(
    (set) => ({
      boards: createDemoBoards(),
      addBoard: (title, description, color) => {
        const board: Board = { id: createId(), title: title.trim(), description: description.trim(), color, createdAt: new Date().toISOString() }
        set((state) => ({ boards: [...state.boards, board] }))
        return board
      },
      removeBoard: (id) => set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),
      resetDemo: () => set({ boards: createDemoBoards() }),
    }),
    { name: 'taskflow:boards', version: 1 },
  ),
)
