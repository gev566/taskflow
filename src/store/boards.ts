import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Board, BoardDraft, Column, Task, TaskDraft } from '../types'
import { moveItem, moveToColumn } from '../utils/array'
import { createId } from '../utils/id'
import { taskFieldsFromDraft } from '../utils/tasks'
import { createDemoBoards, createDemoColumns, createDemoTasks, DEFAULT_COLUMNS } from './demo'

interface BoardsState {
  boards: Board[]
  columns: Column[]
  tasks: Task[]
  addBoard: (draft: BoardDraft) => Board
  updateBoard: (id: string, draft: BoardDraft) => void
  removeBoard: (id: string) => void
  addColumn: (boardId: string, title: string) => void
  renameColumn: (id: string, title: string) => void
  removeColumn: (id: string) => void
  moveColumn: (id: string, direction: -1 | 1) => void
  addTask: (draft: TaskDraft) => Task
  updateTask: (id: string, draft: TaskDraft) => void
  removeTask: (id: string) => void
  moveTask: (id: string, columnId: string, index: number) => void
  resetDemo: () => void
}

const clean = (draft: BoardDraft) => ({ ...draft, title: draft.title.trim(), description: draft.description.trim() })

// Хранилище досок и колонок. persist сам сохраняет состояние в localStorage и восстанавливает при загрузке.
export const useBoardsStore = create<BoardsState>()(
  persist(
    (set, get) => ({
      boards: createDemoBoards(),
      columns: createDemoColumns(),
      tasks: createDemoTasks(),

      addBoard: (draft) => {
        const board: Board = { id: createId(), ...clean(draft), createdAt: new Date().toISOString() }
        // У новой доски сразу три стандартные колонки
        const columns = DEFAULT_COLUMNS.map((title) => ({ id: createId(), boardId: board.id, title }))
        set((s) => ({ boards: [...s.boards, board], columns: [...s.columns, ...columns] }))
        return board
      },
      updateBoard: (id, draft) =>
        set((s) => ({ boards: s.boards.map((b) => (b.id === id ? { ...b, ...clean(draft) } : b)) })),
      // Вместе с доской удаляем её колонки и задачи в них
      removeBoard: (id) =>
        set((s) => {
          const columnIds = new Set(s.columns.filter((c) => c.boardId === id).map((c) => c.id))
          return {
            boards: s.boards.filter((b) => b.id !== id),
            columns: s.columns.filter((c) => c.boardId !== id),
            tasks: s.tasks.filter((t) => !columnIds.has(t.columnId)),
          }
        }),

      addColumn: (boardId, title) =>
        set((s) => ({ columns: [...s.columns, { id: createId(), boardId, title: title.trim() }] })),
      renameColumn: (id, title) =>
        set((s) => ({ columns: s.columns.map((c) => (c.id === id ? { ...c, title: title.trim() } : c)) })),
      // Колонка удаляется вместе со своими задачами
      removeColumn: (id) =>
        set((s) => ({ columns: s.columns.filter((c) => c.id !== id), tasks: s.tasks.filter((t) => t.columnId !== id) })),
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

      addTask: (draft) => {
        const task: Task = { id: createId(), ...taskFieldsFromDraft(draft), createdAt: new Date().toISOString() }
        set((s) => ({ tasks: [...s.tasks, task] }))
        return task
      },
      updateTask: (id, draft) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...taskFieldsFromDraft(draft) } : t)) })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      // Перетаскивание: колонка и позиция внутри неё
      moveTask: (id, columnId, index) => set((s) => ({ tasks: moveToColumn(s.tasks, id, columnId, index) })),

      resetDemo: () => set({ boards: createDemoBoards(), columns: createDemoColumns(), tasks: createDemoTasks() }),
    }),
    {
      name: 'taskflow:boards',
      version: 3,
      // v1 — без колонок: начинаем с демо-данных. v2 — без задач: доски и колонки оставляем, задачи пустые.
      migrate: (persisted, version) => {
        if (version < 2) return { boards: createDemoBoards(), columns: createDemoColumns(), tasks: createDemoTasks() }
        return { ...(persisted as Pick<BoardsState, 'boards' | 'columns'>), tasks: [] }
      },
    },
  ),
)

// Колонки одной доски в нужном порядке
export const selectColumns = (boardId: string) => (s: BoardsState) => s.columns.filter((c) => c.boardId === boardId)

// Задачи одной колонки в нужном порядке
export const selectTasks = (columnId: string) => (s: BoardsState) => s.tasks.filter((t) => t.columnId === columnId)
